"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, Download, FileText } from "lucide-react"

const payslips = [
  { id: "1", month: "January 2024", amount: "$5,200", status: "Paid", date: "2024-01-31" },
  { id: "2", month: "December 2023", amount: "$5,200", status: "Paid", date: "2023-12-31" },
  { id: "3", month: "November 2023", amount: "$5,200", status: "Paid", date: "2023-11-30" },
  { id: "4", month: "October 2023", amount: "$5,100", status: "Paid", date: "2023-10-31" },
  { id: "5", month: "September 2023", amount: "$5,100", status: "Paid", date: "2023-09-30" },
]

export function PayslipsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Payslips</h1>
        <p className="text-muted-foreground">View and download your payslips</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Payslip History
          </CardTitle>
          <CardDescription>Your salary payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payslips.map((payslip) => (
              <div
                key={payslip.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payslip.month}</p>
                    <p className="text-sm text-muted-foreground">Issued: {payslip.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-foreground">{payslip.amount}</p>
                    <Badge className="bg-success text-success-foreground">{payslip.status}</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
