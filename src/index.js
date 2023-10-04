// const fs = require("fs");
// const express = require("express");
// const dotenv = require("dotenv");
// const resources = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/resources.json`)
// );

// dotenv.config();
// const app = express();

// app.use(express.json());

// module.exports = { app, server }; // Export both app and server

const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const resources = JSON.parse(
  fs.readFileSync(`${__dirname}/data/resources.json`)
);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const PORT = process.env.PORT || 3000;

// Define an endpoint to retrieve the resources data
// app.get("/resources", (req, res) => {
//   res.status(200).json(resources);
// });

// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.get("/resources", (req, res) => {
  const { category } = req.query;

  if (!category) {
    // If no category query parameter is provided, respond with a 400 Bad Request
    // res.status(400).json({ message: "Category parameter is required" });
    res.status(200).json(resources);
  } else {
    // Filter resources based on the provided category
    const filteredResources = resources.filter(
      (resource) => resource.category.toLowerCase() === category.toLowerCase()
    );

    // if (filteredResources.length > 0) {
    // If resources are found for the specified category, respond with a 200 status and the filtered resources
    res.status(200).json(filteredResources);
    // } else {
    // If no resources are found for the specified category, respond with a 404 status and a message
    // res
    //   .status(404)
    //   .json({ message: `No resources found for category: ${category}` });
    // }
  }
});

app.get("/resources/sort", (req, res) => {
  const { sortBy } = req.query;

  if (!sortBy) {
    // If no 'sortBy' query parameter is provided, respond with a 400 Bad Request
    const { order } = req.query;

    if (!order) {
      // If no 'order' query parameter is provided, respond with a 400 Bad Request
      res.status(400).json({ message: "Order parameter is required" });
    } else if (order !== "asc" && order !== "desc") {
      // If 'order' is not 'asc' or 'desc', respond with a 400 Bad Request
      res
        .status(400)
        .json({ message: "Order parameter must be 'asc' or 'desc'" });
    } else {
      // Sort resources based on the provided order
      const sortedResources = [...resources].sort((a, b) => {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });

      // Respond with a 200 status and the sorted resources
      res.status(200).json(sortedResources);
    }
    // res.status(400).json({ message: "sortBy parameter is required" });
  } else {
    // Check if the 'sortBy' parameter is a valid field in the resource objects
    if (!resources[0].hasOwnProperty(sortBy)) {
      res.status(400).json({ message: "Invalid sortBy parameter" });
    } else {
      // Sort resources based on the provided sortBy field
      const sortedResources = [...resources].sort((a, b) => {
        return a[sortBy].localeCompare(b[sortBy]);
      });

      // Respond with a 200 status and the sorted resources
      res.status(200).json(sortedResources);
    }
  }
});

app.get("/resources/group", (req, res) => {
  const groupedResources = groupResources(resources);

  // Respond with a 200 status and the grouped resources
  res.status(200).json(groupedResources);
});

// Function to group resources
function groupResources(resources) {
  // Create an object to store grouped resources
  const grouped = {};

  // Group resources based on a specific criteria, for example, 'category'
  resources.forEach((resource) => {
    const key = resource.category; // You can change this to the criteria you want to group by
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(resource);
  });

  return grouped;
}

module.exports = { app, server };
