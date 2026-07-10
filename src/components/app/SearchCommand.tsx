import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, X, BookOpen, User as UserIcon, Tag, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/lib/mock-data";

interface SearchResult {
  type: "course" | "instructor" | "category";
  id: string;
  title: string;
  subtitle?: string;
  icon: typeof BookOpen;
  to?: string;
  metadata?: Record<string, unknown>;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const normalized = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalized.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);
  
  return (
    <>
      {before}
      <span className="bg-brand/30 text-brand font-semibold">{match}</span>
      {after}
    </>
  );
}

interface SearchCommandProps {
  isInHeader?: boolean;
  disabled?: boolean;
  closeSignal?: number;
  onOpenChange?: (open: boolean) => void;
}

export function SearchCommand({
  isInHeader = false,
  disabled = false,
  closeSignal,
  onOpenChange,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const disabledRef = useRef(false);
  const selectedIndexRef = useRef(0);
  const flatResultsRef = useRef<SearchResult[]>([]);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const courseSearchIndex = useMemo(() => {
    return courses.map((course) => ({
      course,
      normalizedTitle: normalizeText(course.title),
      normalizedSummary: normalizeText(course.summary),
      normalizedCategory: normalizeText(course.category),
    }));
  }, []);

  const instructorStats = useMemo(() => {
    const map = new Map<
      string,
      { normalized: string; courses: number; totalRating: number }
    >();

    courses.forEach((course) => {
      const current = map.get(course.instructor);
      if (current) {
        current.courses += 1;
        current.totalRating += course.rating;
      } else {
        map.set(course.instructor, {
          normalized: normalizeText(course.instructor),
          courses: 1,
          totalRating: course.rating,
        });
      }
    });

    return map;
  }, []);

  const categoryStats = useMemo(() => {
    const map = new Map<string, { normalized: string; courses: number }>();

    courses.forEach((course) => {
      const current = map.get(course.category);
      if (current) {
        current.courses += 1;
      } else {
        map.set(course.category, {
          normalized: normalizeText(course.category),
          courses: 1,
        });
      }
    });

    return map;
  }, []);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeText(query);
    const searchResults: SearchResult[] = [];

    // Search courses
    courseSearchIndex.forEach(({ course, normalizedTitle, normalizedSummary, normalizedCategory }) => {
      const titleMatch = normalizedTitle.includes(normalizedQuery);
      const summaryMatch = normalizedSummary.includes(normalizedQuery);
      const categoryMatch = normalizedCategory.includes(normalizedQuery);

      if (titleMatch || summaryMatch || categoryMatch) {
        searchResults.push({
          type: "course",
          id: course.id,
          title: course.title,
          subtitle: `${course.category} • ${course.level}`,
          icon: BookOpen,
          to: `/courses/${course.id}`,
          metadata: {
            rating: course.rating,
            students: course.students,
            instructor: course.instructor,
          },
        });
      }
    });

    // Search instructors
    instructorStats.forEach((stats, instructor) => {
      if (stats.normalized.includes(normalizedQuery)) {
        searchResults.push({
          type: "instructor",
          id: instructor,
          title: instructor,
          subtitle: `${stats.courses} ${stats.courses === 1 ? "curso" : "cursos"}`,
          icon: UserIcon,
          metadata: {
            courseCount: stats.courses,
            avgRating: stats.totalRating / stats.courses,
          },
        });
      }
    });

    // Search categories
    categoryStats.forEach((stats, category) => {
      if (stats.normalized.includes(normalizedQuery)) {
        searchResults.push({
          type: "category",
          id: category,
          title: category,
          subtitle: `${stats.courses} ${stats.courses === 1 ? "curso" : "cursos"}`,
          icon: Tag,
          metadata: {
            courseCount: stats.courses,
          },
        });
      }
    });

    // Sort by type priority (courses first, then instructors, then categories)
    const priority = { course: 0, instructor: 1, category: 2 };
    return searchResults.sort((a, b) => priority[a.type] - priority[b.type]);
  }, [query, courseSearchIndex, instructorStats, categoryStats]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      course: [],
      instructor: [],
      category: [],
    };

    results.forEach((result) => {
      groups[result.type].push(result);
    });

    return groups;
  }, [results]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(
    () => [...groupedResults.course, ...groupedResults.instructor, ...groupedResults.category],
    [groupedResults]
  );

  const flatIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    flatResults.forEach((result, index) => {
      map.set(`${result.type}:${result.id}`, index);
    });
    return map;
  }, [flatResults]);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const openModal = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  }, []);

  const handleClearQuery = useCallback(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    flatResultsRef.current = flatResults;
  }, [flatResults]);

  // Keyboard navigation - registered once to avoid listener churn under fast state updates.
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditableTarget =
        !!target && (target.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT");

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        if (disabledRef.current && !openRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (!openRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        return;
      }

      if (!openRef.current) return;

      if (isEditableTarget && target !== inputRef.current) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const total = flatResultsRef.current.length;
        if (total === 0) {
          setSelectedIndex(0);
          return;
        }
        setSelectedIndex((prev) => {
          if (e.key === "ArrowDown") return (prev + 1) % total;
          return (prev - 1 + total) % total;
        });
        return;
      }

      if (e.key === "Enter") {
        const selected = flatResultsRef.current[selectedIndexRef.current] ?? null;
        if (selected?.to && selected.type === "course") {
          e.preventDefault();
          void navigate({ to: selected.to as never });
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus management for faster perceived response and keyboard continuity.
  useEffect(() => {
    if (open) {
      const rafId = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(rafId);
    }

    triggerRef.current?.focus();
  }, [open]);

  // Route changes should always reset transient search state.
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, [pathname]);

  // Allow parent shell to force-close search (for panel exclusivity).
  useEffect(() => {
    if (closeSignal === undefined) return;
    setOpen(false);
  }, [closeSignal]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Close search panel on outside click with a single stable listener.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!openRef.current) return;
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const selectedResult = flatResults[selectedIndex];
  const hasResults = flatResults.length > 0;

  return (
    <div className={cn("relative", !isInHeader && "fixed top-4 left-4 z-50")}>
      {/* Search Icon Button */}
      <button
        ref={triggerRef}
        onClick={openModal}
        disabled={disabled}
        aria-label="Pesquisar"
        aria-expanded={open}
        aria-controls="search-command-panel"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "transition-all duration-300 shadow-lg",
          !isInHeader && "fixed top-4 left-4 z-50",
          open
            ? "bg-gradient-brand border-2 border-brand/50 scale-110 shadow-xl"
            : "bg-card border-2 border-border hover:bg-secondary hover:border-brand hover:shadow-xl",
          disabled && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border hover:shadow-lg",
          "active:scale-95"
        )}
      >
        <Search className={cn(
          "h-5 w-5 transition-all duration-300",
          open ? "text-brand-foreground rotate-45 scale-110" : "text-muted-foreground hover:text-foreground"
        )} />
      </button>

      {/* Search Panel */}
      {open && (
        <div
          id="search-command-panel"
          ref={panelRef}
          className={cn(
            "fixed z-70 w-[92vw] max-w-2xl animate-in fade-in zoom-in-95 duration-200",
            "rounded-2xl border border-border bg-card shadow-2xl",
            isInHeader
              ? "left-1/2 top-20 -translate-x-1/2"
              : "left-1/2 top-24 -translate-x-1/2",
            "max-h-[75vh] flex flex-col overflow-hidden"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Pesquisa avançada"
        >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <Search className="h-5 w-5 text-brand" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Pesquisa avançada — cursos, instrutores, categorias..."
                value={query}
                onChange={handleInputChange}
                className={cn(
                  "flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground",
                  "font-display text-foreground"
                )}
              />
              {query && (
                <button
                  onClick={handleClearQuery}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Limpar pesquisa"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={closeModal}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {!query.trim() ? (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                  <div className="rounded-full bg-gradient-brand/10 p-4">
                    <Sparkles className="h-8 w-8 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Comece a pesquisar</h3>
                    <p className="text-sm text-muted-foreground">
                      Encontre cursos, instrutores e categorias de forma inteligente
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <kbd className="rounded bg-secondary px-2 py-1">↑↓</kbd>
                    <span>Navegar</span>
                    <kbd className="rounded bg-secondary px-2 py-1">↵</kbd>
                    <span>Selecionar</span>
                    <kbd className="rounded bg-secondary px-2 py-1">Esc</kbd>
                    <span>Fechar</span>
                  </div>
                </div>
              ) : !hasResults ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                  <div className="rounded-full bg-secondary p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Nenhum resultado</h3>
                    <p className="text-sm text-muted-foreground">
                      Nenhum curso, instrutor ou categoria encontrado para "{query}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 px-3 py-3" role="listbox" aria-label="Resultados da pesquisa">
                  {/* Courses Section */}
                  {groupedResults.course.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <TrendingUp className="h-3 w-3" />
                        Cursos
                      </div>
                      <div className="space-y-1">
                        {groupedResults.course.map((result) => {
                          const isSelected = selectedResult?.id === result.id && selectedResult?.type === "course";
                          return (
                            <ResultItem
                              key={`${result.type}-${result.id}`}
                              result={result}
                              query={query}
                              isSelected={isSelected}
                              onHover={() => {
                                const index = flatIndexByKey.get(`course:${result.id}`);
                                if (index !== undefined) setSelectedIndex(index);
                              }}
                              onSelect={() => {
                                if (result.to) {
                                  setOpen(false);
                                }
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Instructors Section */}
                  {groupedResults.instructor.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <UserIcon className="h-3 w-3" />
                        Instrutores
                      </div>
                      <div className="space-y-1">
                        {groupedResults.instructor.map((result) => {
                          const isSelected = selectedResult?.id === result.id && selectedResult?.type === "instructor";
                          return (
                            <div
                              key={`${result.type}-${result.id}`}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 cursor-pointer",
                                isSelected
                                  ? "bg-gradient-brand text-brand-foreground shadow-lg"
                                  : "bg-secondary text-foreground hover:bg-secondary/80"
                              )}
                              onMouseEnter={() => {
                                const index = flatIndexByKey.get(`instructor:${result.id}`);
                                if (index !== undefined) setSelectedIndex(index);
                              }}
                            >
                              <UserIcon className="h-4 w-4 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">
                                  {highlightMatch(result.title, query)}
                                </div>
                                <div className="text-xs opacity-75">{result.subtitle}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Categories Section */}
                  {groupedResults.category.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Tag className="h-3 w-3" />
                        Categorias
                      </div>
                      <div className="space-y-1">
                        {groupedResults.category.map((result) => {
                          const isSelected = selectedResult?.id === result.id && selectedResult?.type === "category";
                          return (
                            <div
                              key={`${result.type}-${result.id}`}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 cursor-pointer",
                                isSelected
                                  ? "bg-gradient-brand text-brand-foreground shadow-lg"
                                  : "bg-secondary text-foreground hover:bg-secondary/80"
                              )}
                              onMouseEnter={() => {
                                const index = flatIndexByKey.get(`category:${result.id}`);
                                if (index !== undefined) setSelectedIndex(index);
                              }}
                            >
                              <Tag className="h-4 w-4 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">
                                  {highlightMatch(result.title, query)}
                                </div>
                                <div className="text-xs opacity-75">{result.subtitle}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {hasResults && (
              <div className="border-t border-border px-6 py-3 bg-secondary/30 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  Resultado <span className="font-semibold text-foreground">{selectedIndex + 1}</span> de{" "}
                  <span className="font-semibold text-foreground">{flatResults.length}</span>
                </span>
                <div className="flex gap-2">
                  <kbd className="rounded bg-background px-2 py-1">↵</kbd>
                  <span>para navegar</span>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

interface ResultItemProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onHover: () => void;
  onSelect: () => void;
}

const ResultItem = memo(function ResultItem({ result, query, isSelected, onHover, onSelect }: ResultItemProps) {
  const Icon = result.icon;
  const metadata = result.metadata as any;

  if (result.type === "course") {
    return (
      <Link
        to={result.to!}
        onClick={() => onSelect()}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 cursor-pointer no-underline",
          isSelected
            ? "bg-gradient-brand text-brand-foreground shadow-lg"
            : "bg-secondary text-foreground hover:bg-secondary/80"
        )}
        onMouseEnter={onHover}
        role="option"
        aria-selected={isSelected}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">
            {highlightMatch(result.title, query)}
          </div>
          <div className="text-xs opacity-75 flex items-center gap-1">
            {result.subtitle}
            {metadata?.rating && (
              <>
                <span>•</span>
                <span>⭐ {metadata.rating}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 cursor-pointer",
        isSelected
          ? "bg-gradient-brand text-brand-foreground shadow-lg"
          : "bg-secondary text-foreground hover:bg-secondary/80"
      )}
      onMouseEnter={onHover}
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">
          {highlightMatch(result.title, query)}
        </div>
        <div className="text-xs opacity-75">{result.subtitle}</div>
      </div>
    </div>
  );
});
