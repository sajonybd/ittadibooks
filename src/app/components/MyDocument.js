 

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  image: {
    width: 400,
    height: 600,
    marginBottom: 10,
  },
});

const MyDocument = ({ book }) => (
  <Document>
    {book.pagesImages.map((page) => (
      <Page key={page.pageNumber} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Page {page.pageNumber}</Text>
        </View>
        <View style={styles.section}>
          <Image src={page.url} style={styles.image} />
        </View>
      </Page>
    ))}
  </Document>
);

export default MyDocument;
