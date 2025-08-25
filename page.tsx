import React from 'react';

const JobzaLandingPage = () => {
  return (
    <div className="bg-[#f8f9fc] text-[#0e111b] min-h-screen">
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7eaf3] px-10 py-4 shadow-sm">
            <div className="flex items-center gap-3 text-[#0e111b]">
              {/* <svg className="h-8 w-8 text-[#2c5ee8]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
              </svg> */}
              <h1 className="text-[#0e111b] text-xl font-bold leading-tight tracking-[-0.015em]">Jobza</h1>
            </div>
            {/* <nav className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-[#0e111b] text-sm font-medium leading-normal hover:text-[#2c5ee8] transition-colors" href="#">Find Workers</a>
                <a className="text-[#0e111b] text-sm font-medium leading-normal hover:text-[#2c5ee8] transition-colors" href="#">For Workers</a>
                <a className="text-[#0e111b] text-sm font-medium leading-normal hover:text-[#2c5ee8] transition-colors" href="#">Resources</a>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#2c5ee8] text-[#f8f9fc] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                <span className="truncate">Get Started</span>
              </button>
            </nav> */}
          </header>

          {/* Main Content */}
          <main className="flex flex-1 flex-col">
            {/* Hero Section */}
            <div className="py-10 lg:px-5">
              <div className="relative min-h-[520px] rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxW4mHmOy3zdC9SZFYw3_rftR-hyAHhG2BpCROnF3IMgO9cC0fZ5yvScq70MNB8a18OiWz0VuKUm3qEh28pcTUppvrBfJ2rXKhFMNe4XM5EAZspte0jWAWXc95lm-gvzw0x-UHTggAIEVWJxGNgN-iAX1AgtJTqporszf6a1vSWDYNiE1V3jb_FvEYWD4VtFaTbK1Kv1SYBwxoNzjlOurKGM5izDch9K6pijTetiNvLSNazUmgTmK5p1ZTgdmL02I2nRjqCeaAEQg")`
                  }}
                />
                <div className="relative flex flex-col items-start justify-end h-full p-12 text-white">
                  <div className="max-w-2xl space-y-4">
                    <h1 className="text-5xl font-black leading-tight tracking-tighter">Find the perfect domestic worker for your home</h1>
                    <h2 className="text-lg font-normal leading-normal">Jobza connects you with experienced and reliable domestic workers, making your life easier and your home happier.</h2>
                  </div>
                  <button className="mt-8 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#2c5ee8] text-[#f8f9fc] text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                    <span className="truncate">Find Workers</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Why Choose Section */}
            <section className="px-20 py-20 lg:px-40 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-[#0e111b] text-4xl font-black leading-tight tracking-[-0.033em] max-w-2xl mx-auto">Why choose Jobza?</h1>
                  <p className="text-[#0e111b] text-lg font-normal leading-normal max-w-3xl mx-auto mt-4">We're committed to providing a safe, reliable, and efficient platform for connecting homeowners with domestic workers.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-4 rounded-xl border border-[#e7eaf3] bg-[#f8f9fc] p-6 text-center items-center transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg fill="#2c5ee8" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#0e111b] text-xl font-bold leading-tight">Verified Workers</h2>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal">All workers undergo a thorough background check and verification process.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-[#e7eaf3] bg-[#f8f9fc] p-6 text-center items-center transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg fill="#2c5ee8" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#0e111b] text-xl font-bold leading-tight">Wide Selection</h2>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal">Choose from a diverse pool of qualified domestic workers to meet your specific needs.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-[#e7eaf3] bg-[#f8f9fc] p-6 text-center items-center transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg fill="#2c5ee8" height="32px" viewBox="0 0 256 256" width="32px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[#0e111b] text-xl font-bold leading-tight">Flexible Scheduling</h2>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal">Easily schedule and manage your domestic worker's hours to fit your lifestyle.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="px-20 py-20 lg:px-40">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-[#0e111b] text-4xl font-black leading-tight tracking-[-0.033em] max-w-2xl mx-auto">Find the right help for your home</h1>
                  <p className="text-[#0e111b] text-lg font-normal leading-normal max-w-3xl mx-auto mt-4">Whether you need a housekeeper, gardener, or nanny, Jobza has the perfect match for you.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-4 group">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300" 
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1WIsBlZ-9yLibOry9RKms-fkhF3nxIFIxOqoVXUINWUcuvFZ4ZHmfYepJoHYP0fA2tSqSsoEc4cFIvBZ4fuOsET8sXDgzQBmkNQCNETkTWr6_yYycrG-O6JKt6MKnkwpern14KRnnDhp6qd_OjYosUNC5rDLEk66_b9_2sxc2yDo0jtWcqrAlq6YGhBmb9ko9gF8STUsR-3oL0SP8H4HMn0mQd3sPyHY8lwgNAomh0sQ9XjyIJH_nnm0yL7KwiAMwZv8Pt-x_vgI")`
                      }}
                    />
                    <div className="text-center">
                      <p className="text-[#0e111b] text-xl font-bold leading-normal">Housekeeping</p>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal mt-1">Keep your home sparkling clean with our network of experienced housekeepers.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 group">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300" 
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIS2wQYe1TzxEIde8YMvMK6Q7zEIWWOVEDCyWDFPhySt2xqOg2Ncpdf0bK66lNopHX-Db0Pgrg3MD0X5NVV4FYmWxbS6NSSjcaSkRaPmfSnzJq2ffY6wurfJBRwE_7DFcAsG47XpHUe0EbvLXGt2lYMXZSfqvzlL-Z0YLSVsOGw98cKC6ZbP83rYC7H0F1MK-4xewHdIIdxCekwa5YC0DPuD3CMSIZa3Al49bFLSm-UUijK4CnhnUSjjAP_qe0SeqRiKTEcQhkneM")`
                      }}
                    />
                    <div className="text-center">
                      <p className="text-[#0e111b] text-xl font-bold leading-normal">Gardening</p>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal mt-1">Maintain a beautiful and healthy outdoor space with skilled gardeners.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 group">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300" 
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDYD9Kdw9yTPKovr3ZGF9OTBsjmSumFLmW5FI0GRay2HL9ehKO2KOO4HPFB2nNqgLB2GWa0iqs3hLRMlkU_hLKfETptYuMwseX2Lzc4gJBBPUj4kKA-qFpCCDlfiuo_rvjc3N4LkeKALF9JzvKDoMudbyXiffa9b8_PhlA3l7fehteyMCQx4D4YjumFjSYsKffuL78aO5JOgx63FfKwfX5t2CP0BCFPGG_0izoHvi6Qh46q9fpS-MF4Jj3Hkzxec4Bpb6a8I-wJx8")`
                      }}
                    />
                    <div className="text-center">
                      <p className="text-[#0e111b] text-xl font-bold leading-normal">Childcare</p>
                      <p className="text-[#4e6297] text-sm font-normal leading-normal mt-1">Find trustworthy and caring nannies to look after your children.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white px-20 py-20 lg:px-40">
              <div className="max-w-4xl mx-auto text-center bg-[#f8f9fc] rounded-2xl p-16">
                <h1 className="text-[#0e111b] text-4xl font-black leading-tight tracking-[-0.033em]">Ready to simplify your home life?</h1>
                <p className="text-[#0e111b] text-lg font-normal leading-normal mt-4 max-w-2xl mx-auto">Join Jobza today and experience the convenience of finding reliable domestic help.</p>
                <div className="mt-8 flex justify-center">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#2c5ee8] text-[#f8f9fc] text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                    <span className="truncate">Get Started</span>
                  </button>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 py-10 px-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 md:mb-0">
                <a className="text-[#4e6297] text-sm font-normal leading-normal hover:text-[#2c5ee8] transition-colors" href="#">About Us</a>
                <a className="text-[#4e6297] text-sm font-normal leading-normal hover:text-[#2c5ee8] transition-colors" href="#">Contact</a>
                <a className="text-[#4e6297] text-sm font-normal leading-normal hover:text-[#2c5ee8] transition-colors" href="#">Terms of Service</a>
                <a className="text-[#4e6297] text-sm font-normal leading-normal hover:text-[#2c5ee8] transition-colors" href="#">Privacy Policy</a>
              </div>
              <p className="text-[#4e6297] text-sm font-normal leading-normal">© 2025 Jobza. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default JobzaLandingPage;