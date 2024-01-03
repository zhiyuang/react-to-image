import * as React from "react";
import { writeFileSync } from "fs";
import { Container, View, Image, Text } from "../src/components";
import { renderToStream } from "../src/index";

renderToStream(
  <Container style={{ width: 500, height: 500, backgroundColor: "orange" }}>
    <View
      style={{
        width: 460,
        height: 380,
        marginTop: 100,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        backgroundColor: "white",
      }}
    >
      <Image
        src={__dirname + "/icon.png"}
        style={{
          width: 80,
          height: 80,
          marginLeft: 180,
          backgroundColor: "green",
        }}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "yellow",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            width: 90,
            height: 60,
            borderRadius: 5
          }}
        >
          <Text>test1</Text>
        </View>
        <View
          style={{
            backgroundColor: "blue",
            width: 90,
            height: 60,
            borderRadius: 5
          }}
        >
          <Text>test5</Text>
        </View>
      </View>
    </View>
  </Container>
).then(buffer => {
  writeFileSync('./test.png', buffer);
});
