"use client";
import React from 'react';
import { AutoComplete } from 'antd';

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const Searchfiledbutton: React.FC = () => (
  <AutoComplete
    style={{ width: 300 }}
    options={options}
    placeholder="find your job"
    filterOption={(inputValue, option) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);

export default Searchfiledbutton;