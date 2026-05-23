'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SelectComponent = ({ languageText, allLanguages, setLanguageSelectInput }) => {
  return (
    <div className="relative w-full">
      <Select onValueChange={(value) => setLanguageSelectInput(value)}>
        <SelectTrigger className="w-full !border-2 !border-black">
          <SelectValue placeholder={languageText} />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-md">
          {allLanguages.map((language) => (
            <SelectItem key={language.languageCode} value={language.languageCode}>
              {language.languageName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
