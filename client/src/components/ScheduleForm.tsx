import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ScheduleFormProps {
  scheduleData: {
    date: string;
    time: string;
    caption: string;
    hashtags: string[];
  };
  onDataChange: (data: any) => void;
}

export default function ScheduleForm({ scheduleData, onDataChange }: ScheduleFormProps) {
  const quickOptions = [
    {
      label: "In 1 Hour",
      icon: "fas fa-clock",
      getValue: () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return {
          date: date.toISOString().split('T')[0],
          time: date.toTimeString().slice(0, 5),
        };
      },
    },
    {
      label: "Tomorrow",
      icon: "fas fa-calendar-day",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(14, 0, 0, 0); // 2 PM
        return {
          date: date.toISOString().split('T')[0],
          time: "14:00",
        };
      },
    },
    {
      label: "Peak Time",
      icon: "fas fa-fire",
      getValue: () => {
        const date = new Date();
        date.setHours(18, 0, 0, 0); // 6 PM (typical peak time)
        return {
          date: date.toISOString().split('T')[0],
          time: "18:00",
        };
      },
    },
    {
      label: "Next Week",
      icon: "fas fa-calendar-week",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        date.setHours(14, 0, 0, 0);
        return {
          date: date.toISOString().split('T')[0],
          time: "14:00",
        };
      },
    },
  ];

  const handleQuickOption = (option: any) => {
    const { date, time } = option.getValue();
    onDataChange(prev => ({ ...prev, date, time }));
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Schedule Settings</h2>
        
        {/* Date & Time */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Input 
              type="date" 
              value={scheduleData.date}
              onChange={(e) => onDataChange(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <Input 
              type="time" 
              value={scheduleData.time}
              onChange={(e) => onDataChange(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        {/* Quick Schedule Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Quick Options</label>
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickOption(option)}
                className="p-3 h-auto flex-col space-y-1 hover:border-gray-300 transition-colors"
              >
                <i className={`${option.icon} text-gray-600`}></i>
                <span className="text-xs text-gray-600">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
