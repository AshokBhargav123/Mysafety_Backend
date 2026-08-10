import { Model } from "mongoose";

interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  sort?: Record<string, 1 | -1>;
  select?: string;
  populate?: any;
}

interface PaginationResult<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const paginate = async (
  model: Model<any>,
  filter: Record<string, any> = {},
  options: PaginationOptions = {}
): Promise<PaginationResult> => {
  const requestedPage = Number(options.page);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const requestedLimit = Number(options.limit);

  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;

  const skip = (page - 1) * limit;

  const query = model
    .find(filter)
    .skip(skip)
    .limit(limit);

  if (options.select) {
    query.select(options.select);
  }

  if (options.sort) {
    query.sort(options.sort);
  }

  if (options.populate) {
    query.populate(options.populate);
  }

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};