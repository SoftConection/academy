import { Link } from "@tanstack/react-router";
import { Star, Clock, BookOpen } from "lucide-react";
import type { Course } from "@/lib/mock-data";
import { formatKz } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand"
    >
      <div className={cn("relative h-32 bg-linear-to-br", course.color)}>
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground">
          {course.level}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-primary">{course.category}</p>
        <h3 className="mt-1 line-clamp-2 font-bold leading-snug">{course.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.instructor}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {course.rating}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.lessons}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.hours}h</span>
        </div>
        {course.progress !== undefined ? (
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div className="h-1.5 rounded-full bg-gradient-brand" style={{ width: `${course.progress}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{course.progress}% concluído</p>
          </div>
        ) : (
          <p className="mt-4 font-display font-bold text-foreground">{formatKz(course.price)}</p>
        )}
      </div>
    </Link>
  );
}