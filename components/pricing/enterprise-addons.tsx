"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ENTERPRISE_ADDONS } from "@/lib/pricing-config"
import * as Icons from "lucide-react"

export default function EnterpriseAddons() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Enterprise add-ons to fit your needs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {ENTERPRISE_ADDONS.map((addon, index) => {
          const IconComponent = Icons[addon.icon as keyof typeof Icons]

          return (
            <Card key={index} className="bg-white border-2 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{addon.title}</h3>
                    <p className="text-gray-400 mb-4">{addon.description}</p>
                    <Button variant="link" className="text-primary p-0 hover:text-primary/80">
                      Read the docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

