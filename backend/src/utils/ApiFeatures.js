export class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // Pagination: Only handles pagination (no limit involved)
  pagination() {
    const PAGE_LIMIT = 20;
    let PAGE_NUMBER = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) PAGE_NUMBER = 1;
    const PAGE_SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT;

    this.mongooseQuery.skip(PAGE_SKIP);
    return this;
  }

  // Limit: Separate method to handle limit independently of pagination
  limit() {
    const LIMIT = this.queryString.limit * 1 || 15; // Default to 20 if no limit is passed
    this.mongooseQuery.limit(LIMIT);
    return this;
  }
  filteration() {
    let filterObj = { ...this.queryString };
    let excludedQuery = ["page", "sort", "fields", "keyword", "limit"];

    excludedQuery.forEach((ele) => {
      delete filterObj[ele];
    });

    // Check for price range filter (price[lte] and price[gte])
    if (this.queryString["price[gte]"] || this.queryString["price[lte]"]) {
      filterObj.price = {}; // Initialize price filter object

      // Assign the appropriate price filters if values exist
      if (this.queryString["price[gte]"]) {
        const minPrice = Number(this.queryString["price[gte]"]);
        if (!isNaN(minPrice)) {
          filterObj.price["$gte"] = minPrice;
        }
      }
      if (this.queryString["price[lte]"]) {
        const maxPrice = Number(this.queryString["price[lte]"]);
        if (!isNaN(maxPrice)) {
          filterObj.price["$lte"] = maxPrice;
        }
      }
    }

    // Handle query operators (like gt, gte, lt, lte)
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);

    // Pass the constructed filter to the Mongoose query
    this.mongooseQuery.find(filterObj);
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  // Search
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  // Fields Selection
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  priceBasedSize;
}
