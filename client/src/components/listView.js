import React from 'react';
import { ListView } from 'react-native';

const Listview = ({source} => {
  return (
    <ListView dataSource = {source} renderRow={(rowData) => <Text>{rowData}</Text>} >
  )
})
