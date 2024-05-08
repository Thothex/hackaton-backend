  function countImages(data) {
    try {
        // const data = JSON.parse(jsonData);
        // if (!data.annotations || !Array.isArray(data.annotations)) {
        //     throw new Error("Invalid JSON format: 'annotations' field is missing or not an array.");
        // }

        return data.length;
    } catch (error) {
        console.error("Error parsing JSON:", error.message);
         return 0;
    }
}
module.exports = countImages


