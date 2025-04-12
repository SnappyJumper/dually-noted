import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

/**
 * TagSelector is a multi-select input using react-select,
 * allowing users to pick from existing tags or create new ones.
 * It fetches available tags from the backend and synchronizes
 * newly created tags with the backend as well.
 */
const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const [options, setOptions] = useState([]);

  // Fetch all available tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/tags/");
        const tagOptions = data.map(tag => ({
          label: tag.name,
          value: tag.id,
        }));
        setOptions(tagOptions);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    fetchTags();
  }, []);

  // Create a new tag in the backend and update select options
  const handleCreate = async (inputValue) => {
    try {
      const { data } = await axios.post("/tags/", { name: inputValue });
      const newOption = { label: data.name, value: data.id };
      setOptions(prev => [...prev, newOption]); // Add to available options
      setSelectedTags(prev => [...prev, newOption]); // Add to selected tags
    } catch (err) {
      console.error("Tag creation failed", err);
    }
  };

  // Update selected tags
  const handleChange = (newValue) => {
    setSelectedTags(newValue);
  };

  return (
    <div className="my-3">
      <label><strong>Tags:</strong></label>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={selectedTags}
      />
    </div>
  );
};

export default TagSelector;
