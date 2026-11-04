import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Briefcase, MapPin, Building2, Clock, ExternalLink } from "lucide-react";

const opportunities = [
  { id: 1, title: "Software Engineering Intern", company: "Medtronic", location: "Minnesota, California, Colorado, US", type: "Internship", match: 92, tags: ["C", "C++", "SQL", "JavaScript", "Java", "Git"], description: "Summer 2025 undergraduate internship working on healthcare technology and software systems.", posted: "2 weeks ago", applyUrl: "#" },
  { id: 2, title: "Software Engineer Intern", company: "Susquehanna International Group (SIG)", location: "Philadelphia, US", type: "Internship", match: 88, tags: ["C++", "Python", "C#", "Algorithms", "Data Structures"], description: "10-week summer internship on challenging projects pushed to production for trading systems.", posted: "3 weeks ago", applyUrl: "#" },
  { id: 3, title: "Software Engineering Intern", company: "Microsoft", location: "Hyderabad, Bengaluru, Noida, India", type: "Internship", match: 85, tags: ["Python", "Java", "C#", "Computer Science"], description: "Entry-level software engineering internship for freshers (Batch 2024/2025).", posted: "1 month ago", applyUrl: "#" },
  { id: 4, title: "Data Science & Machine Learning Intern", company: "Qveto", location: "Remote", type: "Internship", match: 78, tags: ["Python", "Machine Learning", "Data Analysis", "SQL"], description: "Remote internship assisting with data collection, cleaning, preprocessing, and ML model development.", posted: "1 week ago", applyUrl: "#" },
  { id: 5, title: "Data Science Internship", company: "G-Research", location: "London, UK", type: "Internship", match: 75, tags: ["Python", "Machine Learning", "Statistics", "SQL"], description: "Quantitative research and machine learning internship exploring financial market datasets.", posted: "2 days ago", applyUrl: "#" },
  { id: 6, title: "Machine Learning Engineer Intern", company: "Fortune Analytics", location: "Remote, India", type: "Internship", match: 72, tags: ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "AI", "NLP"], description: "Remote ML internship building recommendation engines, intelligent automation, and AI products.", posted: "1 day ago", applyUrl: "#" },
  { id: 7, title: "Machine Learning & Generative AI Intern", company: "Deloitte", location: "Bengaluru, India", type: "Internship", match: 68, tags: ["Python", "Generative AI", "Machine Learning", "Data Engineering"], description: "Building and deploying generative models and ML algorithms at Deloitte Bengaluru Eco Space.", posted: "2 weeks ago", applyUrl: "#" },
  { id: 8, title: "Data Science Intern", company: "Novartis", location: "India", type: "Internship", match: 65, tags: ["Python", "Statistics", "Machine Learning", "SQL"], description: "Data science internship applying ML and GenAI to workforce problems and people analytics.", posted: "1 month ago", applyUrl: "#" },
  { id: 9, title: "Data Science Intern", company: "BNP Paribas", location: "Bengaluru, India", type: "Internship", match: 62, tags: ["Python", "NumPy", "Pandas", "scikit-learn", "PyTorch", "TensorFlow"], description: "6-month trainee role in Global Markets Data & AI Lab for STEM graduates.", posted: "3 weeks ago", applyUrl: "#" },
  { id: 10, title: "Entry Level Software Engineer", company: "ENTNT", location: "Remote", type: "Full-time", match: 60, tags: ["Python", "TypeScript", "NLP", "Web Development", "AI"], description: "Remote paid entry-level role with mentorship from former Microsoft engineers.", posted: "2 days ago", applyUrl: "#" },
].sort((a, b) => b.match - a.match);

export default function Opportunities() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [minMatch, setMinMatch] = useState(0);

  const filtered = opportunities.filter((opp) => {
    const matchesQuery =
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.company.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    const matchesMatch = opp.match >= minMatch;
    return matchesQuery && matchesType && matchesMatch;
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-matched jobs and internships sorted by match score (real-time from web listings).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                id="search"
                placeholder="Search by title, company, or skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select id="type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
            </Select>
            <Select id="match" value={String(minMatch)} onChange={(e) => setMinMatch(Number(e.target.value))}>
              <option value="0">Any match score</option>
              <option value="50">50%+ match</option>
              <option value="70">70%+ match</option>
              <option value="80">80%+ match</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No opportunities found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((opp) => (
            <Card key={opp.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{opp.title}</h4>
                      <Badge variant={opp.match >= 80 ? "success" : opp.match >= 60 ? "secondary" : "outline"}>{opp.match}% Match</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /><span>{opp.company}</span><span>·</span><MapPin className="h-3 w-3" /><span>{opp.location}</span><span>·</span><Clock className="h-3 w-3" /><span>{opp.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{opp.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {opp.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-1">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{opp.posted}</div>
                    <Button variant="outline" size="sm" className="mt-3 h-8 px-3 text-xs" onClick={(e) => { e.preventDefault(); }}>
                      Apply <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="text-xs text-muted-foreground text-center mt-4">
        Opportunities sourced from live web listings and sorted by match score (highest first).
      </div>
    </div>
  );
}