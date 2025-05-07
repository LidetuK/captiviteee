import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReputationMetrics } from "@/lib/reputation/reputationManager";

interface ReputationMetricsChartProps {
  metrics: ReputationMetrics | null;
  title: string;
  description?: string;
}

const ReputationMetricsChart: FC<ReputationMetricsChartProps> = ({
  metrics,
  title,
  description,
}) => {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // In a real implementation, this would use a charting library like recharts or chart.js
  // For now, we'll just display a placeholder
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Chart visualization would appear here
          </p>
          <p className="text-sm">
            Average Rating: {metrics.metrics.averageRating.toFixed(1)}/5
          </p>
          <p className="text-sm">
            Total Reviews: {metrics.metrics.totalReviews}
          </p>
          <p className="text-sm">
            Response Rate: {(metrics.metrics.responseRate * 100).toFixed(0)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationMetricsChart;
