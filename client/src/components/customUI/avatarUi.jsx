import { useState, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { PROFESSIONS } from "@/data/professions";

const AvatarUi = ({
  avatarUrl,
  onFileChange,
  onProfessionChange,
  selectedProfession,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleProfessionClick = (profession) => {
    onProfessionChange(profession);
    setIsOpen(false);
  };

  const filteredProfessions = PROFESSIONS.filter((profession) =>
    profession.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="py-4 flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        <span
          className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full cursor-pointer"
          onClick={handleAvatarClick}
        >
          <img
            className="aspect-square h-full w-full"
            src={avatarUrl || "/02.png"}
            alt="Avatar"
          />
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input shadow-sm  h-9 px-4 py-2"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {selectedProfession || "Select a Profession ..."}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4 text-muted-foreground"
              >
                <path
                  d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-md">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search Professions..."
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">Professions</p>
              <ul className="max-h-60 overflow-y-auto">
                {filteredProfessions.map((profession) => (
                  <li
                    key={profession}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProfessionClick(profession)}
                  >
                    {profession}
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AvatarUi;
