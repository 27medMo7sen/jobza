#!/usr/bin/env bash
set -euo pipefail

# Config
BASE_URL=${BASE_URL:-"http://localhost:3000"}
ROLE=${ROLE:-worker} # worker|employer|agency|all
EMAIL_BASE=${EMAIL_BASE:-"test"}
PASSWORD=${PASSWORD:-"Passw0rd!"}
LOG_FILE=${LOG_FILE:-"/tmp/api_smoke_$(date +%s).log"}

# Helpers
jq_check() { command -v jq >/dev/null 2>&1 || { echo "jq is required"; exit 1; }; }
req() {
  local method=$1; shift
  local url=$1; shift
  local data=${1:-}
  if [[ -n "$data" ]]; then
    curl -sS -X "$method" "$url" -H 'Content-Type: application/json' -d "$data"
  else
    curl -sS -X "$method" "$url"
  fi
}
code() {
  # usage: code METHOD URL [DATA]
  local method=$1; shift
  local url=$1; shift
  local data=${1:-}
  if [[ -n "$data" ]]; then
    curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" -H 'Content-Type: application/json' -d "$data"
  else
    curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url"
  fi
}
pass() { echo -e "PASS  $1" | tee -a "$LOG_FILE"; }
fail() { echo -e "FAIL  $1\n$2" | tee -a "$LOG_FILE"; exit 1; }

scenario() {
  local ROLE=$1
  local EMAIL="${EMAIL_BASE}+${ROLE}+$(date +%s)@example.com"

  echo "\n=== Scenario: $ROLE ===" | tee -a "$LOG_FILE"

  # 1) Health
  local health
  health=$(req GET "$BASE_URL/health/db" || true)
  echo "$health" | jq . >/dev/null 2>&1 || fail "health" "$health"
  [[ $(echo "$health" | jq -r .ok) == "true" ]] || fail "health" "$health"
  pass "health"

  # 2) Signup per role
  local signup_body
  if [[ "$ROLE" == "worker" ]]; then
    signup_body=$(jq -n --arg email "$EMAIL" --arg pass "$PASSWORD" '{email:$email, password:$pass, confirmPassword:$pass, role:"worker", firstName:"Test", lastName:"User", phoneNumber:"1234567890", nationality:"EG", gender:"male", dateOfBirth:"1990-01-01"}')
  elif [[ "$ROLE" == "employer" ]]; then
    signup_body=$(jq -n --arg email "$EMAIL" --arg pass "$PASSWORD" '{email:$email, password:$pass, confirmPassword:$pass, role:"employer", firstName:"Emp", lastName:"Loyer", phoneNumber:"1234567890", gender:"male", nationality:"EG", dateOfBirth:"1990-01-01", country:"EG", householdSize:2, householdComposition:{adults:2,children:0,infants:0,elderly:0}, homeType:"apt", serviceRequirements:["cleaning"], workingHours:"9-5", preferredStartDate:"2025-09-01", budgetRange:{min:100,max:200,currency:"USD"}}')
  else
    signup_body=$(jq -n --arg email "$EMAIL" --arg pass "$PASSWORD" '{email:$email, password:$pass, confirmPassword:$pass, role:"agency", agencyName:"My Agency", agencyType:"staffing", registrationNumber:"123", licenseNumber:"456", establishmentDate:"2010-01-01", phoneNumber:"1234567890", website:"https://example.org", fullName:"Owner Name", streetAddress:"1 St", city:"Cairo", state:"C", country:"EG", postalCode:"12345", businessDescription:"desc", yearsInBusiness:5, numberOfEmployees:10}')
  fi
  local signup
  signup=$(req POST "$BASE_URL/auth/${ROLE}/signup" "$signup_body" || true)
  echo "$signup" | jq . >/dev/null 2>&1 || fail "signup" "$signup"
  pass "signup $ROLE"

  # 3) Negative: bad login password -> 401
  local bad_login_code
  bad_login_code=$(code POST "$BASE_URL/auth/login" "$(jq -n --arg email "$EMAIL" '{email:$email, password:"wrong"}')")
  [[ "$bad_login_code" == "401" ]] || fail "login-bad-password" "$bad_login_code"
  pass "login-bad-password"

  # 4) Login
  local login_body login token
  login_body=$(jq -n --arg email "$EMAIL" --arg pass "$PASSWORD" '{email:$email, password:$pass}')
  login=$(curl -sS -X POST "$BASE_URL/auth/login" -H 'Content-Type: application/json' -d "$login_body" -c /tmp/cookies.txt -b /tmp/cookies.txt || true)
  echo "$login" | jq . >/dev/null 2>&1 || fail "login" "$login"
  token=$(echo "$login" | jq -r '.token // .user.token // empty')
  [[ -n "$token" ]] || fail "login-token" "$login"
  pass "login"

  # 5) Negative: authenticate without header -> 400
  local noauth_code
  noauth_code=$(code GET "$BASE_URL/auth/authenticate")
  [[ "$noauth_code" == "400" ]] || fail "authenticate-missing-header" "$noauth_code"
  pass "authenticate-missing-header"

  # 6) User by token (get user id & email)
  local user_by_token user_id user_email
  user_by_token=$(curl -sS -H "Authorization: Bearer $token" "$BASE_URL/auth/authenticate" || true)
  echo "$user_by_token" | jq . >/dev/null 2>&1 || fail "authenticate" "$user_by_token"
  user_id=$(echo "$user_by_token" | jq -r '._id // .id // empty')
  user_email=$(echo "$user_by_token" | jq -r '.email // empty')
  [[ -n "$user_id" ]] || fail "extract-user-id" "$user_by_token"
  pass "authenticate"

  # 7) Get user by email
  local by_email
  by_email=$(req GET "$BASE_URL/auth/user/$user_email" || true)
  echo "$by_email" | jq . >/dev/null 2>&1 || fail "get-user-by-email" "$by_email"
  pass "get-user-by-email"

  # 8) Update profile
  local update_body update_resp
  if [[ "$ROLE" == "worker" ]]; then
    update_body=$(jq -n '{workerData:{firstName:"Updated"}}')
  elif [[ "$ROLE" == "employer" ]]; then
    update_body=$(jq -n '{employerData:{homeType:"villa"}}')
  else
    update_body=$(jq -n '{agencyData:{agencyType:"licensed"}}')
  fi
  update_resp=$(curl -sS -X PUT "$BASE_URL/auth/update/$user_id" -H 'Content-Type: application/json' -d "$update_body" || true)
  echo "$update_resp" | jq . >/dev/null 2>&1 || fail "update-profile" "$update_resp"
  pass "update-profile"

  # 9) Negative: replace file without file -> 400
  local missfile_code
  missfile_code=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE_URL/auth/files/$user_id" -F label=passport -F type=document)
  [[ "$missfile_code" == "400" ]] || fail "replace-file-missing" "$missfile_code"
  pass "replace-file-missing"

  # 10) Replace/upload a labeled document via multipart (passport)
  local tmpfile=/tmp/smoke_doc_$$.txt
  echo "hello $(date)" > "$tmpfile"
  local replace_resp
  replace_resp=$(curl -sS -X PUT "$BASE_URL/auth/files/$user_id" \
    -F label=passport \
    -F type=document \
    -F issuanceDate=2025-01-01 \
    -F expirationDate=2026-01-01 \
    -F file=@"$tmpfile" || true)
  rm -f "$tmpfile"
  echo "$replace_resp" | jq . >/dev/null 2>&1 || fail "replace-file" "$replace_resp"
  pass "replace-file"

  # 11) List files (requires auth)
  local files_list
  files_list=$(curl -sS -X POST "$BASE_URL/files/list" -H "Authorization: Bearer $token" || true)
  echo "$files_list" | jq . >/dev/null 2>&1 || fail "files-list" "$files_list"
  echo "$files_list" | jq -e 'has("passport")' >/dev/null 2>&1 || fail "files-list-has-label" "$files_list"
  pass "files-list"

  # 12) Refresh token
  local refresh_body refresh
  refresh_body=$(jq -n --arg t "$token" '{token:$t}')
  refresh=$(req POST "$BASE_URL/auth/refresh-token" "$refresh_body" || true)
  echo "$refresh" | jq . >/dev/null 2>&1 || fail "refresh-token" "$refresh"
  pass "refresh-token"
}

main() {
  jq_check
  echo "BASE_URL=$BASE_URL" | tee "$LOG_FILE" >/dev/null

  if [[ "$ROLE" == "all" ]]; then
    for r in worker employer agency; do
      scenario "$r"
    done
    echo "All role scenarios passed." | tee -a "$LOG_FILE"
  else
    scenario "$ROLE"
    echo "Scenario $ROLE passed." | tee -a "$LOG_FILE"
  fi
}

main "$@"
