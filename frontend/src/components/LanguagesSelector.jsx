import * as React from 'react';

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

// Function that allows the user to select a programming language.
const LanguageSelector = ({ language, onSelect }) => {
  const [selectLanguage, setSelectLanguage] = React.useState('');

  const handleChange = (event) => {
    setSelectLanguage(event.target.value);
    onSelect(event.target.value);
  }
  return (
  <FormControl fullWidth>
    <InputLabel id="language-select">Language</InputLabel>
    <Select
      labelId="language-select"
      id="select-language"
      value={selectLanguage}
      label="Language"
      onChange={handleChange}
    >
      <MenuItem value="javascript">Javascript</MenuItem>
      <MenuItem value="python">Python</MenuItem>
      <MenuItem value="c">C</MenuItem>
    </Select>
  </FormControl>
  )
}

export default LanguageSelector;
