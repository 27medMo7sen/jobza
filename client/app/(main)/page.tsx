import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Home, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">
                J
              </span>
            </div>
            <span className="text-3xl font-bold text-foreground">Jobza</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Domestic Worker Marketplace
          </h1>
          <p className="text-muted-foreground">
            Choose your dashboard to get started
          </p>
        </div>
        <div>
          <Card className="flex justify-center">
            <CardHeader>
              <CardTitle>Welcome to Jobza</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Jobza is your go-to platform for connecting with trusted
                domestic workers. Whether you're a worker looking for
                opportunities or a family in need of assistance, we've got you
                covered.
              </p>
            </CardContent>
            <div className="flex justify-center">
              <Link href={"/auth"}>
                <Button variant="outline">Get Started</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
