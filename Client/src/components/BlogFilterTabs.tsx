import { Tabs, Tab, Box } from "@mui/material";

const tabOptions = [
  { label: "All", value: "all" },
  { label: "Favorites", value: "favorites" },
];

const BlogFilterTabs = ({
  displayFavorites,
  setDisplayFavorites,
}: {
  displayFavorites: boolean;
  setDisplayFavorites: (val: boolean) => void;
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    const value = newValue === "favorites" ? true : false;
    setDisplayFavorites(value   );
  };

  return (
    <Box mb={2}>
      <Tabs
        value={displayFavorites==true?"favorites":"all"}
        onChange={handleChange}
        aria-label="blog filter tabs"
        indicatorColor="primary"
        textColor="primary"
      >
        {tabOptions.map((tab) => (
          <Tab key={tab.label} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
};

export default BlogFilterTabs;
