import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface ScheduleData {
  date: string;
  time: string;
  caption: string;
  hashtags: string[];
}

interface ScheduleFormProps {
  scheduleData: ScheduleData;
  onDataChange: (data: ScheduleData) => void;
}

export default function ScheduleForm({
  scheduleData,
  onDataChange,
}: ScheduleFormProps) {
  const updateScheduleData = (field: keyof ScheduleData, value: any) => {
    onDataChange({ ...scheduleData, [field]: value });
  };

  const getMinDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().split("T")[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (scheduleData.date === today) {
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return "00:00";
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Schedule Settings
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={scheduleData.date}
              onChange={(e) => updateScheduleData("date", e.target.value)}
              min={getMinDateTime()}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <Input
              type="time"
              value={scheduleData.time}
              onChange={(e) => updateScheduleData("time", e.target.value)}
              min={getMinTime()}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <i className="fas fa-info-circle mr-2"></i>
          Your post will be published on{" "}
          {new Date(
            `${scheduleData.date}T${scheduleData.time}`,
          ).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
