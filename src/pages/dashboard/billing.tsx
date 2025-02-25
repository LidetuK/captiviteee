import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, Clock, Download } from "lucide-react";

const BillingPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Subscriptions</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" /> Update Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Current Plan</h3>
            <Button variant="outline" size="sm">
              Change Plan
            </Button>
          </div>
          <p className="text-2xl font-bold mb-2">Business Bundle</p>
          <p className="text-sm text-muted-foreground">$747.99/month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Next Payment</h3>
            <Clock className="text-primary h-5 w-5" />
          </div>
          <p className="text-2xl font-bold mb-2">$747.99</p>
          <p className="text-sm text-muted-foreground">Due Apr 1, 2024</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Payment Status</h3>
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Active
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">Auto-pay</p>
          <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {[
              { date: "Mar 1, 2024", amount: "$747.99", status: "Paid" },
              { date: "Feb 1, 2024", amount: "$747.99", status: "Paid" },
              { date: "Jan 1, 2024", amount: "$747.99", status: "Paid" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.amount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-green-600">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillingPage;
