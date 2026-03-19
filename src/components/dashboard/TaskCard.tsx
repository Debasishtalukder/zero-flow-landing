import { useState } from "react";
import { Check, X, Flame, Clock, MoreVertical, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FocusModeModal from "./FocusModeModal";

interface TaskCardProps {
  id: string;
  name: string;
  duration: string;
  dayProgress: string;
  percentage: number;
  bgColor: string;
  index: number;
  todayStatus?: string;
  onDone: () => void;
  onMissed: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  category?: string;
  categoryColor?: string;
  isVacation?: boolean;
  isScheduledToday?: boolean;
}

// 6-slot rotating palette — exact colors from spec
const PALETTES = [
  {
    gradFrom: "#C8F5D0", gradTo: "#E8FDF5",
    ring: "#22C55E", ringTrack: "rgba(34,197,94,0.15)",
    text: "#166534", shadow: "rgba(34,197,94,0.28)",
    badge: "rgba(34,197,94,0.12)", label: "mint",
  },
  {
    gradFrom: "#FFE5CC", gradTo: "#FFF0E6",
    ring: "#F97316", ringTrack: "rgba(249,115,22,0.15)",
    text: "#9A3412", shadow: "rgba(249,115,22,0.28)",
    badge: "rgba(249,115,22,0.1)", label: "peach",
  },
  {
    gradFrom: "#C5E8FF", gradTo: "#E8F4FF",
    ring: "#3B82F6", ringTrack: "rgba(59,130,246,0.15)",
    text: "#1D4ED8", shadow: "rgba(59,130,246,0.28)",
    badge: "rgba(59,130,246,0.1)", label: "sky",
  },
  {
    gradFrom: "#E9D5FF", gradTo: "#F3E8FF",
    ring: "#9333EA", ringTrack: "rgba(147,51,234,0.15)",
    text: "#6B21A8", shadow: "rgba(147,51,234,0.28)",
    badge: "rgba(147,51,234,0.1)", label: "lilac",
  },
  {
    gradFrom: "#FEF9C3", gradTo: "#FFFBE6",
    ring: "#EAB308", ringTrack: "rgba(234,179,8,0.15)",
    text: "#854D0E", shadow: "rgba(234,179,8,0.28)",
    badge: "rgba(234,179,8,0.1)", label: "yellow",
  },
  {
    gradFrom: "#FFD6E0", gradTo: "#FFF0F3",
    ring: "#EC4899", ringTrack: "rgba(236,72,153,0.15)",
    text: "#9D174D", shadow: "rgba(236,72,153,0.28)",
    badge: "rgba(236,72,153,0.1)", label: "pink",
  },
];

const TaskCard = ({ id, name, duration, dayProgress, percentage, index, todayStatus, onDone, onMissed, onEdit, onDelete, category, categoryColor, isVacation, isScheduledToday = true }: TaskCardProps) => {
  const [showFocus, setShowFocus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? "1.02" : "1",
  };
  const p = PALETTES[index % PALETTES.length];
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isCompleted = todayStatus === "completed";
  const isMissed = todayStatus === "missed";

  const handleDone = () => {
    onDone();
    toast({ title: `${name} completed! ✓`, description: "Great job! Keep it up!" });
  };

  const handleMissed = () => {
    onMissed();
    toast({ title: `${name} missed`, description: "Don't worry, try again tomorrow!", variant: "destructive" });
  };

  // Not scheduled today overlay
  if (!isScheduledToday) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          background: `linear-gradient(145deg, #E5E7EB 0%, #F3F4F6 100%)`,
          boxShadow: `inset 0 2px 8px rgba(255,255,255,0.75), 0 8px 20px -8px rgba(0,0,0,0.08)`,
        }}
        className="relative rounded-3xl p-6 flex flex-col gap-4 opacity-60"
      >
        <div {...attributes} {...listeners} className="absolute top-4 left-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-40 cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <h3 className="font-heading font-extrabold text-[1.1rem] leading-snug break-words pr-12 text-gray-400">{name}</h3>
        <div className="flex items-center gap-2">
          {category && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold bg-gray-200 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
              {category}
            </span>
          )}
        </div>
        <div className="clay-card-sm px-4 py-2 text-center">
          <p className="text-sm font-heading font-bold text-gray-400">📅 Not scheduled today</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          background: `linear-gradient(145deg, ${p.gradFrom} 0%, ${p.gradTo} 100%)`,
          boxShadow: isDragging 
            ? `0 20px 40px -12px ${p.shadow}` 
            : `inset 0 2px 8px rgba(255,255,255,0.75), 0 12px 40px -8px ${p.shadow}, 0 4px 16px -4px ${p.shadow}`,
        }}
        className={`relative rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 ${!isDragging ? 'hover:-translate-y-2' : ''} group`}
      >
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-4 left-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          style={{ color: p.text }}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Top right area */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {isCompleted && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full mr-2"
              style={{ backgroundColor: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 glow-orange" />
              <span className="text-[10px] font-heading font-bold text-orange-600">Streak!</span>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:bg-white/40 transition-all"
                style={{ color: p.text }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
              <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer focus:bg-violet-50 focus:text-violet-700">
                <Pencil className="w-4 h-4" /> Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)} 
                className="gap-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category dot + Task name */}
        {category && (
          <div className="flex items-center gap-1.5 mb--2">
            <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: categoryColor || p.ring }} />
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider" style={{ color: p.text + "99" }}>{category}</span>
          </div>
        )}

        <h3 className="font-heading font-extrabold text-[1.1rem] leading-snug break-words pr-12" style={{ color: p.text }}>
          {name}
        </h3>

        {/* Info pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-heading font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.75)", color: p.text }}
          >
            {duration}
          </span>
          <span
            className="px-3 py-1 rounded-full text-[11px] font-body"
            style={{ backgroundColor: p.badge, color: p.text + "cc" }}
          >
            {dayProgress}
          </span>
        </div>

        {/* Ring + actions row */}
        <div className="flex items-center justify-between mt-1">
          {/* SVG ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r={radius} fill="none" stroke={p.ringTrack} strokeWidth="8" />
              <circle
                cx="44" cy="44" r={radius}
                fill="none"
                stroke={p.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ 
                  transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1), stroke 0.3s ease", 
                  filter: `drop-shadow(0 0 6px ${p.ring}88)` 
                }}
                className="group-hover:stroke-[10px] transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-[15px] leading-none" style={{ color: p.text }}>
                {percentage}%
              </span>
              <span style={{ fontSize: "9px", color: p.text + "99" }} className="font-body">done</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-end gap-2">
            {isVacation ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-heading font-bold bg-amber-100 text-amber-700 border border-amber-200">
                🏖️ Paused
              </span>
            ) : isCompleted ? (
              <span
                className="px-4 py-1.5 rounded-full text-xs font-heading font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.8)", color: p.ring, border: `1.5px solid ${p.ring}55` }}
              >
                ✓ Done
              </span>
            ) : isMissed ? (
              <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-heading font-bold border border-red-200">
                Missed
              </span>
            ) : (
              <>
                <button
                  onClick={handleDone}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#16a34a", border: "1.5px solid rgba(34,197,94,0.35)" }}
                >
                  <Check className="w-3.5 h-3.5" /> Done
                </button>
                <button
                  onClick={handleMissed}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#dc2626", border: "1.5px solid rgba(239,68,68,0.35)" }}
                >
                  <X className="w-3.5 h-3.5" /> Skip
                </button>
              </>
            )}
            
            {!isVacation && (
              <button 
                onClick={() => setShowFocus(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold opacity-80 hover:opacity-100 transition-opacity mt-1"
                style={{ backgroundColor: "rgba(255,255,255,0.4)", color: p.text }}
              >
                <Clock className="w-3.5 h-3.5" /> Focus
              </button>
            )}
          </div>
        </div>
      </div>
      
      <FocusModeModal 
        open={showFocus} 
        onClose={() => setShowFocus(false)} 
        taskName={name} 
        accentColor={p.ring} 
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-bold text-xl">Delete Task?</AlertDialogTitle>
            <AlertDialogDescription className="font-body text-muted-foreground">
              Are you sure you want to delete <span className="font-bold text-foreground">"{name}"</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
