import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ServiceMetrics {
  textBack: {
    missedCalls: number;
    avgDealValue: number;
    conversionRate: number;
  };
  reputation: {
    monthlyReviews: number;
    ratingImprovement: number;
  };
  scheduling: {
    noShows: number;
    avgAppointmentValue: number;
    staffHours: number;
  };
}

interface ROICalculatorProps {
  onCalculate?: (total: number) => void;
}

const calculateServiceROI = (metrics: ServiceMetrics) => {
  const textBackROI =
    metrics.textBack.missedCalls *
    metrics.textBack.avgDealValue *
    (metrics.textBack.conversionRate / 100) *
    12; // Annual

  const reputationROI =
    metrics.reputation.monthlyReviews *
    (metrics.reputation.ratingImprovement * 500) * // Estimated value per rating point
    12; // Annual

  const schedulingROI =
    metrics.scheduling.noShows * metrics.scheduling.avgAppointmentValue * 0.8 + // Reduced no-shows
    metrics.scheduling.staffHours * 25 * 52; // Staff time savings

  return {
    textBack: textBackROI,
    reputation: reputationROI,
    scheduling: schedulingROI,
    total: textBackROI + reputationROI + schedulingROI,
  };
};

const ROICalculator: React.FC<ROICalculatorProps> = ({
  onCalculate = () => {},
}) => {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    textBack: {
      missedCalls: 50,
      avgDealValue: 200,
      conversionRate: 20,
    },
    reputation: {
      monthlyReviews: 30,
      ratingImprovement: 0.5,
    },
    scheduling: {
      noShows: 20,
      avgAppointmentValue: 100,
      staffHours: 10,
    },
  });

  const [roi, setROI] = useState<{
    textBack: number;
    reputation: number;
    scheduling: number;
    total: number;
  }>({ textBack: 0, reputation: 0, scheduling: 0, total: 0 });

  const [isCalculating, setIsCalculating] = useState(false);

  const calculateROI = async () => {
    setIsCalculating(true);
    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const results = calculateServiceROI(metrics);
    setROI(results);
    onCalculate(results.total);
    setIsCalculating(false);
  };

  return (
    <Card className="w-full max-w-4xl p-6">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Text-Back Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="missedCalls">Monthly Missed Calls</Label>
                <Input
                  id="missedCalls"
                  type="number"
                  value={metrics.textBack.missedCalls}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      textBack: {
                        ...prev.textBack,
                        missedCalls: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgDealValue">Avg. Deal Value ($)</Label>
                <Input
                  id="avgDealValue"
                  type="number"
                  value={metrics.textBack.avgDealValue}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      textBack: {
                        ...prev.textBack,
                        avgDealValue: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                <Input
                  id="conversionRate"
                  type="number"
                  value={metrics.textBack.conversionRate}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      textBack: {
                        ...prev.textBack,
                        conversionRate: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Reputation Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyReviews">Monthly Reviews</Label>
                <Input
                  id="monthlyReviews"
                  type="number"
                  value={metrics.reputation.monthlyReviews}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      reputation: {
                        ...prev.reputation,
                        monthlyReviews: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratingImprovement">Rating Improvement</Label>
                <Input
                  id="ratingImprovement"
                  type="number"
                  value={metrics.reputation.ratingImprovement}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      reputation: {
                        ...prev.reputation,
                        ratingImprovement: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Smart Scheduling</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noShows">Monthly No-Shows</Label>
                <Input
                  id="noShows"
                  type="number"
                  value={metrics.scheduling.noShows}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      scheduling: {
                        ...prev.scheduling,
                        noShows: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgAppointmentValue">
                  Avg. Appointment Value ($)
                </Label>
                <Input
                  id="avgAppointmentValue"
                  type="number"
                  value={metrics.scheduling.avgAppointmentValue}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      scheduling: {
                        ...prev.scheduling,
                        avgAppointmentValue: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffHours">Weekly Staff Hours Saved</Label>
                <Input
                  id="staffHours"
                  type="number"
                  value={metrics.scheduling.staffHours}
                  onChange={(e) =>
                    setMetrics((prev) => ({
                      ...prev,
                      scheduling: {
                        ...prev.scheduling,
                        staffHours: Number(e.target.value),
                      },
                    }))
                  }
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={calculateROI}
          className="w-full relative"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating...
            </div>
          ) : (
            "Calculate ROI"
          )}
          Calculate ROI
        </Button>

        {roi.total > 0 && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-primary mb-1">Text-Back ROI</p>
                <p className="text-xl font-bold">
                  ${roi.textBack.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-primary mb-1">Reputation ROI</p>
                <p className="text-xl font-bold">
                  ${roi.reputation.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-primary mb-1">Scheduling ROI</p>
                <p className="text-xl font-bold">
                  ${roi.scheduling.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-primary mb-2">
                Total Estimated Annual ROI
              </p>
              <p className="text-4xl font-bold text-primary">
                ${roi.total.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ROICalculator;
