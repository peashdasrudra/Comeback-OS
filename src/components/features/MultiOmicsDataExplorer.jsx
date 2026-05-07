import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Database, Filter, ChevronDown, ChevronUp, Search, Layers } from "lucide-react";

const datasets = [
  {
    id: "tcga-brca",
    name: "TCGA-BRCA",
    fullName: "The Cancer Genome Atlas - Breast Invasive Carcinoma",
    type: "Genomic",
    samples: 1098,
    omics: ["Genomics", "Transcriptomics", "Methylation", "Proteomics"],
    description: "Comprehensive multi-omics data for breast cancer subtypes including TNBC, HER2+, and ER+",
    tags: ["Breast Cancer", "TCGA", "Multi-omics"],
    lastUpdated: "2025-12-15",
    status: "Active"
  },
  {
    id: "metabric",
    name: "METABRIC",
    fullName: "Molecular Taxonomy of Breast Cancer International Consortium",
    type: "Genomic",
    samples: 2509,
    omics: ["Genomics", "Transcriptomics", "Copy Number Variation"],
    description: "Large-scale breast cancer study focusing on molecular subtypes and clinical outcomes",
    tags: ["Breast Cancer", "METABRIC", "Clinical"],
    lastUpdated: "2025-11-20",
    status: "Active"
  },
  {
    id: "tcga-luad",
    name: "TCGA-LUAD",
    fullName: "The Cancer Genome Atlas - Lung Adenocarcinoma",
    type: "Genomic",
    samples: 585,
    omics: ["Genomics", "Transcriptomics", "Methylation"],
    description: "Lung adenocarcinoma multi-omics profiling for subtype discovery and biomarker identification",
    tags: ["Lung Cancer", "TCGA", "Adenocarcinoma"],
    lastUpdated: "2026-01-10",
    status: "Active"
  },
  {
    id: "tcga-gbm",
    name: "TCGA-GBM",
    fullName: "The Cancer Genome Atlas - Glioblastoma Multiforme",
    type: "Genomic",
    samples: 617,
    omics: ["Genomics", "Transcriptomics", "Methylation", "Proteomics"],
    description: "Glioblastoma multi-omics data for aggressive brain tumor research and therapeutic targets",
    tags: ["Brain Cancer", "TCGA", "GBM"],
    lastUpdated: "2025-10-08",
    status: "Processing"
  },
  {
    id: "cptac-ccrcc",
    name: "CPTAC-CCRCC",
    fullName: "Clinical Proteomic Tumor Analysis Consortium - Clear Cell Renal Cell Carcinoma",
    type: "Proteomic",
    samples: 216,
    omics: ["Proteomics", "Phosphoproteomics", "Genomics", "Transcriptomics"],
    description: "Integrated proteogenomic characterization of clear cell renal cell carcinoma",
    tags: ["Kidney Cancer", "CPTAC", "Proteomics"],
    lastUpdated: "2026-02-28",
    status: "Active"
  }
];

const omicsTypes = ["All", "Genomics", "Transcriptomics", "Proteomics", "Methylation", "Copy Number Variation"];
const statusFilters = ["All", "Active", "Processing", "Archived"];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const MultiOmicsDataExplorer = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOmics, setSelectedOmics] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesOmics = selectedOmics === "All" || dataset.omics.includes(selectedOmics);
    const matchesStatus = selectedStatus === "All" || dataset.status === selectedStatus;
    return matchesSearch && matchesOmics && matchesStatus;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Multi-omics Data Explorer
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              TCGA-BRCA, METABRIC & research datasets
            </p>
          </div>
        </div>
        <div className="text-xs text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {filteredDatasets.length} datasets
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm placeholder:text-white/20 focus:border-blue-400/50 focus:outline-none transition-colors"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Filter className="w-4 h-4 text-white/40 mt-2.5" />
          <div className="flex flex-wrap gap-2">
            {omicsTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedOmics(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedOmics === type
                    ? "bg-blue-500/30 text-blue-300 border border-blue-400/50"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === status
                  ? status === "Active" ? "bg-green-500/30 text-green-300 border border-green-400/50" :
                    status === "Processing" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-400/50" :
                    "bg-white/20 text-white/70 border border-white/30"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredDatasets.map((dataset, index) => (
            <motion.div
              key={dataset.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-blue-400/30 transition-colors"
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(dataset.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white/90" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {dataset.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        dataset.status === "Active" ? "bg-green-500/20 text-green-400" :
                        dataset.status === "Processing" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {dataset.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      {dataset.fullName}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-white/40" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      <span>{dataset.samples} samples</span>
                      <span>{dataset.omics.length} omics types</span>
                      <span>Updated: {dataset.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedId === dataset.id ? (
                      <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === dataset.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-white/5">
                      <p className="text-sm text-white/60 mt-3 mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {dataset.description}
                      </p>

                      {/* Omics Types */}
                      <div className="mb-3">
                        <div className="text-[10px] text-white/40 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          OMICS TYPES
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dataset.omics.map(omic => (
                            <span
                              key={omic}
                              className="px-2.5 py-1 bg-blue-500/10 border border-blue-400/20 rounded-lg text-[11px] text-blue-300"
                              style={{ fontFamily: "'Share Tech Mono', monospace" }}
                            >
                              {omic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="text-[10px] text-white/40 mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          TAGS
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dataset.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white/50"
                              style={{ fontFamily: "'Share Tech Mono', monospace" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDatasets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-white/30"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          No datasets match your filters
        </motion.div>
      )}
    </motion.div>
  );
};

export default MultiOmicsDataExplorer;
