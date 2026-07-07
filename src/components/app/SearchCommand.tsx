import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
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
}

export function SearchCommand({ isInHeader = false }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract unique instructors and categories from courses
  const uniqueInstructors = useMemo(() => {
    const instructors = new Set(courses.map((c) => c.instructor));
    return Array.from(instructors);
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(courses.map((c) => c.category));
    return Array.from(categories);
  }, []);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeText(query.toLowerCase());
    const searchResults: SearchResult[] = [];

    // Search courses
    courses.forEach((course) => {
      const titleMatch = normalizeText(course.title).includes(normalizedQuery);
      const summaryMatch = normalizeText(course.summary).includes(normalizedQuery);
      const categoryMatch = normalizeText(course.category).includes(normalizedQuery);

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
    uniqueInstructors.forEach((instructor) => {
      if (normalizeText(instructor).includes(normalizedQuery)) {
        const instructorCourses = courses.filter((c) => c.instructor === instructor);
        searchResults.push({
          type: "instructor",
          id: instructor,
          title: instructor,
          subtitle: `${instructorCourses.length} ${instructorCourses.length === 1 ? "curso" : "cursos"}`,
          icon: UserIcon,
          metadata: {
            courseCount: instructorCourses.length,
            avgRating:
              instructorCourses.reduce((sum, c) => sum + c.rating, 0) / instructorCourses.length,
          },
        });
      }
    });

    // Search categories
    uniqueCategories.forEach((category) => {
      if (normalizeText(category).includes(normalizedQuery)) {
        const categoryCoursesCount = courses.filter((c) => c.category === category).length;
        searchResults.push({
          type: "category",
          id: category,
          title: category,
          subtitle: `${categoryCoursesCount} ${categoryCoursesCount === 1 ? "curso" : "cursos"}`,
          icon: Tag,
          metadata: {
            courseCount: categoryCoursesCount,
          },
        });
      }
    });

    // Sort by type priority (courses first, then instructors, then categories)
    const priority = { course: 0, instructor: 1, category: 2 };
    return searchResults.sort((a, b) => priority[a.type] - priority[b.type]);
  }, [query, uniqueInstructors, uniqueCategories]);

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

  // Event handlers
  const handleBackdropClick = useCallback(() => {
    setOpen(false);
  }, []);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  }, []);

  const handleClearQuery = useCallback(() => {
    setQuery("");
  }, []);

  // Memoized keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only block if it's one of our shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setOpen(prev => !prev);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    // Only handle nav keys if modal is open
    if (!open) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => {
        const total = flatResults.length;
        if (total === 0) return 0;
        if (e.key === "ArrowDown") {
          return (prev + 1) % total;
        } else {
          return (prev - 1 + total) % total;
        }
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = flatResults[selectedIndex];
      if (selected?.to) {
        setOpen(false);
      }
    }
  }, [open, flatResults, selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const selectedResult = flatResults[selectedIndex];
  const hasResults = flatResults.length > 0;

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Pesquisar"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "transition-all duration-300 shadow-lg",
          !isInHeader && "fixed top-4 left-4 z-50",
          open
            ? "bg-gradient-brand border-2 border-brand/50 scale-110 shadow-xl"
            : "bg-card border-2 border-border hover:bg-secondary hover:border-brand hover:shadow-xl",
          "active:scale-95"
        )}
      >
        <Search className={cn(
          "h-5 w-5 transition-all duration-300",
          open ? "text-brand-foreground rotate-45 scale-110" : "text-muted-foreground hover:text-foreground"
        )} />
      </button>

      {/* Search Modal Portal */}
      {open && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
          />

          {/* Modal Content */}
          <div
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-300",
              "max-h-[80vh] flex flex-col overflow-hidden"
            )}
            onClick={handleModalClick}
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
                onClick={handleBackdropClick}
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
                <div className="space-y-2 px-3 py-3">
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
                                setSelectedIndex(
                                  flatResults.findIndex(
                                    (r) => r.id === result.id && r.type === "course"
                                  )
                                );
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
                                setSelectedIndex(
                                  flatResults.findIndex(
                                    (r) => r.id === result.id && r.type === "instructor"
                                  )
                                );
                              }}
                            >
                              <UserIcon className="h-4 w-4 flex-shrink-0" />
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
                                setSelectedIndex(
                                  flatResults.findIndex(
                                    (r) => r.id === result.id && r.type === "category"
                                  )
                                );
                              }}
                            >
                              <Tag className="h-4 w-4 flex-shrink-0" />
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
        </>,
        document.body
      )}
    </>
  );
}

interface ResultItemProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onHover: () => void;
  onSelect: () => void;
}

function ResultItem({ result, query, isSelected, onHover, onSelect }: ResultItemProps) {
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
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
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
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">
          {highlightMatch(result.title, query)}
        </div>
        <div className="text-xs opacity-75">{result.subtitle}</div>
      </div>
    </div>
  );
}
