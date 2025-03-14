"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, HelpCircle, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRICING_FEATURES } from "@/lib/pricing-config";
import { Fragment } from "react";

interface FeatureComparisonProps {
  businessType: "chat" | "voice";
}

export default function FeatureComparison({
  businessType,
}: FeatureComparisonProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Compare plans</h2>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="b2c" className="w-[300px] mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-auth0-darker rounded-full p-1">
            <TabsTrigger
              value="b2c"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-auth0-dark data-[state=inactive]:text-white"
            >
              Chat Bot
            </TabsTrigger>
            <TabsTrigger
              value="b2b"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-auth0-dark data-[state=inactive]:text-white"
            >
              Voice Bot
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-8 flex justify-center space-x-4">
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800"
        >
          Start building →
        </Button>
        <Button
          variant="outline"
          className="text-white border-gray-600 bg-gray-800"
        >
          Sign up
        </Button>
        <Button
          variant="outline"
          className="text-white border-gray-600 bg-gray-800"
        >
          Sign up
        </Button>
        <Button
          variant="outline"
          className="text-white border-gray-600 bg-gray-800"
        >
          Contact us →
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="w-[300px]"></TableHead>
              <TableHead className="text-center">Free</TableHead>
              <TableHead className="text-center">Essentials</TableHead>
              <TableHead className="text-center">Professional</TableHead>
              <TableHead className="text-center">Enterprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(PRICING_FEATURES).map(([category, features], index) => (
              <Fragment key={category}>
                <TableRow className="border-gray-800 bg-auth0-darker">
                  <TableCell
                    colSpan={5}
                    className="font-bold text-lg flex items-center"
                  >
                    {category === "authentication" && (
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 15V17M6 9V7C6 4.79086 7.79086 3 10 3H14C16.2091 3 18 4.79086 18 7V9M6 9C3.79086 9 2 10.7909 2 13V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V13C22 10.7909 20.2091 9 18 9M6 9H18"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {category === "branding" && (
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {category === "security" && (
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12L11 14L15 10M20.6179 5.98434C20.4132 5.99472 20.2072 5.99997 20 5.99997C16.9265 5.99997 14.123 4.84453 11.9999 2.94434C9.87691 4.84446 7.07339 5.99985 4 5.99985C3.79277 5.99985 3.58678 5.9946 3.38213 5.98422C3.1327 6.94783 3 7.95842 3 9.00001C3 14.5915 6.82432 19.2898 12 20.622C17.1757 19.2898 21 14.5915 21 9.00001C21 7.95847 20.8673 6.94791 20.6179 5.98434Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {category === "organizations" && (
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TableCell>
                </TableRow>
                {features.map((feature, featureIndex) => (
                  <TableRow
                    key={`${category}-${featureIndex}`}
                    className="border-gray-800"
                  >
                    <TableCell className="flex items-center gap-2">
                      {feature.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[300px]">{feature.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.free)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.essentials)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.professional)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.enterprise)}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function renderFeatureValue(value: boolean | string | null) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="text-green-500 mx-auto" />
    ) : (
      <X className="text-red-500 mx-auto" />
    );
  }
  if (value === null) {
    return "-";
  }
  return value;
}
