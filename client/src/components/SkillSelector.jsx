import { useState } from "react";
import { SKILL_CATEGORIES } from "../constants/skills";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const SkillSelector = ({ selectedSkills, onSkillSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSkillToggle = (skill) => {
    if (selectedSkills.some((s) => s.name === skill.name)) {
      onSkillSelect(selectedSkills.filter((s) => s.name !== skill.name));
    } else {
      onSkillSelect([...selectedSkills, skill]);
    }
  };

  const isSkillSelected = (skillName) => {
    return selectedSkills.some((s) => s.name === skillName);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search skills..."
        className="w-full p-2 border rounded-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Tabs defaultValue={Object.keys(SKILL_CATEGORIES)[0]}>
        <TabsList className="w-full">
          {Object.values(SKILL_CATEGORIES).map((category) => (
            <TabsTrigger key={category.name} value={category.name}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.values(SKILL_CATEGORIES).map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.skills
                  .filter((skill) =>
                    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((skill) => (
                    <div
                      key={skill.name}
                      onClick={() => handleSkillToggle(skill)}
                      className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors ${
                        isSkillSelected(skill.name)
                          ? "bg-primary/10"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <i className={`${skill.iconClass} text-2xl`}></i>
                      <span className="text-sm">{skill.name}</span>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Selected Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill.name}
              onClick={() => handleSkillToggle(skill)}
              className="cursor-pointer px-3 py-1 flex items-center gap-2"
            >
              <i className={`${skill.iconClass} text-lg`}></i>
              {skill.name}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSelector;
