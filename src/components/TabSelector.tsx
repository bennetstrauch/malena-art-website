// src/components/TabSelector.tsx

type TabSelectorProps = {
  tabs: string[];
  selectedTab: string;
  onSelect: (tab: string) => void;
  className?: string;
};

export default function TabSelector({
  tabs,
  selectedTab,
  onSelect,
  className = "",
}: TabSelectorProps) {
  return (
    // for fixity - conditional param passing if needed w/o somewhere else
    <div className="sticky top-0 z-10 bg-white" style={{ paddingTop: "10px" }}>
      <div
        className={`flex justify-center flex-wrap gap-4 mb-8 text-lg ${className}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`px-3 py-1 transition-all duration-200 border-b-2 ${
              selectedTab === tab
                ? "font-semibold border-black"
                : "border-transparent hover:border-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
