import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);

  const events = [
    {
      id: 1,
      title: "Team Meeting",
      description: "Weekly project sync",
      date: new Date(2024, 1, 15, 10, 0),
      duration: 60,
      type: "meeting",
      attendees: ["John Doe", "Sarah Smith"],
      location: "Virtual",
    },
    {
      id: 2,
      title: "Design Review",
      description: "Review new UI components",
      date: new Date(2024, 1, 15, 14, 0),
      duration: 90,
      type: "review",
      attendees: ["Mike Johnson", "Emma Wilson"],
      location: "Conference Room A",
    },
    {
      id: 3,
      title: "Project Deadline",
      description: "MVP Release",
      date: new Date(2024, 1, 20, 17, 0),
      duration: 0,
      type: "deadline",
      attendees: ["All Team Members"],
      location: "N/A",
    },
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: "bg-blue-500 text-white",
      review: "bg-purple-500 text-white",
      deadline: "bg-red-500 text-white",
      other: "bg-gray-500 text-white",
    };
    return colors[type] || colors.other;
  };

  const getEventTypeBorder = (type) => {
    const colors = {
      meeting: "border-l-4 border-blue-500",
      review: "border-l-4 border-purple-500",
      deadline: "border-l-4 border-red-500",
      other: "border-l-4 border-gray-500",
    };
    return colors[type] || colors.other;
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const NewEventDialog = () => (
    <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="Enter event title" />
          </div>
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input type="number" min="0" step="15" defaultValue="60" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input placeholder="Enter location" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Enter description" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowEventDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowEventDialog(false)}>
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EventCard = ({ event }) => (
    <div
      className={`p-2 rounded-md mb-1 ${getEventTypeColor(
        event.type
      )} ${getEventTypeBorder(event.type)}`}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-sm">{event.title}</span>
        <span className="text-xs">{format(event.date, "HH:mm")}</span>
      </div>
      <div className="mt-1 text-xs space-y-1">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{event.duration} mins</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        )}
        {event.attendees && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{event.attendees.length} attendees</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Calendar</h2>
            <p className="text-muted-foreground">
              {format(currentDate, "MMMM yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={today}>
              Today
            </Button>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button onClick={() => setShowEventDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {getDaysInMonth().map((date, index) => {
            const dayEvents = events.filter((event) =>
              isSameDay(event.date, date)
            );
            const isCurrentMonth = isSameMonth(date, currentDate);

            return (
              <div
                key={index}
                className={`bg-background p-2 min-h-[120px] transition-colors ${
                  !isCurrentMonth ? "text-muted-foreground" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {format(date, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary">{dayEvents.length}</Badge>
                  )}
                </div>
                <ScrollArea className="h-[80px]">
                  {dayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>

      <NewEventDialog />
    </div>
  );
};

export default CalendarView;
