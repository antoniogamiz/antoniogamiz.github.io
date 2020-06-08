/** @jsx jsx */

import { jsx, Flex, Box, Text, Divider, Link } from "theme-ui";

export default function Footer() {
  return (
    <Box sx={{ mb: -32 }}>
      <Divider />
      <Flex sx={{ justifyContent: "center" }}>
        <Text variant="styles.small">
          Based on{" "}
          <Link href="https://github.com/PaulieScanlon/gatsby-theme-terminal">
            Terminal
          </Link>{" "}
          by <Link href="https://twitter.com/PaulieScanlon/">Paul Scanlon</Link>
        </Text>
      </Flex>
    </Box>
  );
}
