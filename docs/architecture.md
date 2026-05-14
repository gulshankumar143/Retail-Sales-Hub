# Architecture

## Backend Architecture

- `src/index.js` initializes the Express server, middleware, and routes.
- `src/config/db.js` manages MongoDB connection using Mongoose.
- `src/models/sale.model.js` defines the sales transaction schema and text indexes for efficient search.
- `src/services/sales.service.js` builds query criteria, applies filters, sorts results, and paginates with MongoDB aggregation.
- `src/controllers/sales.controller.js` handles request logic and returns standardized API responses.
- `src/routes/sales.routes.js` exposes the `/api/sales` endpoint.
- `src/middleware/error.middleware.js` handles unhandled routes and exceptions.
- `src/data/seed.js` loads sample records into MongoDB for a reproducible dataset.

## Frontend Architecture

- `src/main.jsx` bootstraps the React app with React Router.
- `src/App.jsx` wraps routes in the query state provider.
- `src/routes/AppRoutes.jsx` configures application routes.
- `src/context/QueryContext.jsx` centralizes search, filter, sort, and pagination state with URL synchronization.
- `src/hooks/useSalesQuery.jsx` requests the API and handles debounced calls, loading, and error states.
- `src/services/api.js` defines a reusable Axios client.
- `src/pages/Dashboard.jsx` composes layout, filters, analytics, table, and pagination.
- `src/components/` contains reusable UI widgets and stateful inputs.
- `src/styles/index.css` contains Tailwind directives and typography styling.

## Folder Structure

- `backend/`
  - `src/controllers`
  - `src/services`
  - `src/models`
  - `src/routes`
  - `src/middleware`
  - `src/config`
  - `src/data`
- `frontend/`
  - `src/components`
  - `src/pages`
  - `src/routes`
  - `src/services`
  - `src/context`
  - `src/hooks`
  - `src/layouts`
  - `src/styles`

## Data Flow

1. User interacts with search, filters, or pagination in the front-end.
2. `QueryContext` updates centralized state and syncs URL query params.
3. `useSalesQuery` observes query state changes and sends debounced requests to `/api/sales`.
4. Backend builds an aggregation pipeline that applies search, filters, sort, and pagination.
5. Backend returns the filtered sales page and metadata.
6. Frontend renders results and updates UI components.

## API Lifecycle

- Request enters Express route `/api/sales`
- Controller delegates to service layer for query building
- Service layer constructs `match` conditions and uses aggregation for pagination and counts
- Middleware handles errors and invalid routes gracefully

## Query Handling Flow

- Full-text search uses case-insensitive regex on `customerName` and `phoneNumber`
- Multi-select filters are converted into `$in` queries
- Numeric range filters use `$gte`/`$lte`
- Date ranges are normalized to JavaScript `Date` objects
- Sorting is applied before pagination in the aggregation pipeline
- Metadata is returned inside `meta` for total pages and record counts

## State Management

- The app uses React Context to centralize filter/search/sort/pagination state
- Query state is exposed to components through `useQueryContext`
- URL queries are synced on every state change, preserving state on refresh
- Debounced API requests avoid frequent network calls during user input

## Scalability Considerations

- Backend aggregation is optimized for server-side pagination and avoids large result sets
- Text indexes and compound indexes help search and filter performance
- Frontend uses memoized components and state updates to reduce re-renders
- The modular folder structure supports feature growth and new endpoints
