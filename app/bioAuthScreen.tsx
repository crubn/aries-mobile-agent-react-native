import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const BioAuthScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Aries Bifold Locked</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  text: { fontSize: 24, fontWeight: "700" },
});

export default BioAuthScreen;
