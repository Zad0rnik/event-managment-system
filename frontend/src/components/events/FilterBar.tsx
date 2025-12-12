'use client';

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  SortByAlpha,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { Category, categoryLabels, EventsQueryParams } from '@/types';

interface FilterBarProps {
  filters: EventsQueryParams;
  onFiltersChange: (filters: EventsQueryParams) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function FilterBar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1,
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value as Category | undefined,
      page: 1,
    });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as EventsQueryParams['sortBy'],
      page: 1,
    });
  };

  const handleSortOrderToggle = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const clearSearch = () => {
    onFiltersChange({ ...filters, search: undefined, page: 1 });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        alignItems: isMobile ? 'stretch' : 'center',
        mb: 4,
      }}
    >
      <TextField
        placeholder="Search events..."
        value={filters.search || ''}
        onChange={(e) => handleSearchChange(e.target.value)}
        size="small"
        sx={{ flex: 1, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category || ''}
          label="Category"
          onChange={(e) => handleCategoryChange(e.target.value)}
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {Object.values(Category).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {categoryLabels[cat]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy || 'date'}
          label="Sort By"
          onChange={(e) => handleSortByChange(e.target.value)}
          MenuProps={{ disableScrollLock: true }}
          startAdornment={
            <InputAdornment position="start">
              <SortByAlpha
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
            </InputAdornment>
          }
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="createdAt">Created</MenuItem>
        </Select>
      </FormControl>

      <Tooltip
        title={
          filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'
        }
      >
        <IconButton
          onClick={handleSortOrderToggle}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          {filters.sortOrder === 'asc' ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {!isMobile && (
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && onViewModeChange(value)}
          size="small"
          sx={{ ml: 'auto' }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
}
