import { ArrowRight,  Cuboid,  Phone, Square } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingChart() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <Card className="bg-purple-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">Transcriber</CardTitle>
            <Square className="h-6 w-6 text-white" />
            <ArrowRight className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-4xl font-bold">
              1¢/min
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-blue-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">Voice</CardTitle>
            <Cuboid className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-4xl font-bold">
              4¢/min
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-green-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">VAPI</CardTitle>
            <div className="bg-green-500 p-1 rounded-lg">
              <p className="text-white font-bold">VAPI</p>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-4xl font-bold">
              7¢/min
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-brown-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">Telephony</CardTitle>
            <Phone className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-4xl font-bold">
              2¢/min
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-teal-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">Model (custom)</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-4xl font-bold">
              5¢/min
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
