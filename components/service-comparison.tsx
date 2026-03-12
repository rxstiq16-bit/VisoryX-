"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  price: number
  turnaround: string
  revisions: number | "unlimited"
  features: string[]
  deliverables: string[]
  isPopular?: boolean
}

interface ServiceComparisonProps {
  services: Service[]
  className?: string
}

export function ServiceComparison({ services, className }: ServiceComparisonProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id].slice(-3) // Max 3
    )
  }

  const comparedServices = services.filter(s => selectedServices.includes(s.id))

  // Get all unique features and deliverables for comparison
  const allFeatures = [...new Set(services.flatMap(s => s.features))]
  const allDeliverables = [...new Set(services.flatMap(s => s.deliverables))]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Service Selection */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center text-sm text-muted-foreground">
          Compare up to 3:
        </span>
        {services.map((service) => (
          <Button
            key={service.id}
            variant={selectedServices.includes(service.id) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleService(service.id)}
            className="gap-1"
          >
            {selectedServices.includes(service.id) ? (
              <Minus className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            {service.name}
          </Button>
        ))}
      </div>

      {/* Comparison Table */}
      {comparedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-left font-medium text-muted-foreground">Feature</th>
                    {comparedServices.map((service) => (
                      <th key={service.id} className="pb-4 text-center">
                        <div className="space-y-1">
                          <span className="font-semibold">{service.name}</span>
                          {service.isPopular && (
                            <Badge variant="default" className="ml-2">Popular</Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Price */}
                  <tr>
                    <td className="py-3 text-sm font-medium">Price</td>
                    {comparedServices.map((service) => (
                      <td key={service.id} className="py-3 text-center">
                        <span className="text-lg font-bold">${service.price}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Turnaround */}
                  <tr>
                    <td className="py-3 text-sm font-medium">Turnaround</td>
                    {comparedServices.map((service) => (
                      <td key={service.id} className="py-3 text-center text-sm">
                        {service.turnaround}
                      </td>
                    ))}
                  </tr>

                  {/* Revisions */}
                  <tr>
                    <td className="py-3 text-sm font-medium">Revisions</td>
                    {comparedServices.map((service) => (
                      <td key={service.id} className="py-3 text-center text-sm">
                        {service.revisions === "unlimited" ? "Unlimited" : service.revisions}
                      </td>
                    ))}
                  </tr>

                  {/* Features */}
                  {allFeatures.map((feature) => (
                    <tr key={feature}>
                      <td className="py-3 text-sm">{feature}</td>
                      {comparedServices.map((service) => (
                        <td key={service.id} className="py-3 text-center">
                          {service.features.includes(feature) ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Deliverables header */}
                  <tr>
                    <td colSpan={comparedServices.length + 1} className="pt-4 pb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Deliverables
                      </span>
                    </td>
                  </tr>

                  {/* Deliverables */}
                  {allDeliverables.map((deliverable) => (
                    <tr key={deliverable}>
                      <td className="py-3 text-sm">{deliverable}</td>
                      {comparedServices.map((service) => (
                        <td key={service.id} className="py-3 text-center">
                          {service.deliverables.includes(deliverable) ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex justify-center gap-4">
              {comparedServices.map((service) => (
                <Button key={service.id} asChild variant={service.isPopular ? "default" : "outline"}>
                  <Link href={`/order?service=${service.id}`}>
                    Order {service.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
