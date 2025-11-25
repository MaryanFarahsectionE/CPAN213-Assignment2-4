import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { movieAPI, withRetry } from '../services/movieAPI';
import { ErrorModal, ConfirmationModal } from '../components/Modals';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [viewMode, setViewMode] = useState('trending');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMovies();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadMovies = async (mode = 'trending') => {
    setLoading(true);
    setError(null);
    setViewMode(mode);
    try {
      let data;
      if (mode === 'popular') {
        data = await withRetry(() => movieAPI.getPopularMovies());
      } else {
        data = await withRetry(() => movieAPI.getTrending('week'));
      }
      setMovies(data.results);
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    movieAPI.clearCache();
    try {
      let data;
      if (viewMode === 'popular') {
        data = await withRetry(() => movieAPI.getPopularMovies());
      } else {
        data = await withRetry(() => movieAPI.getTrending('week'));
      }
      setMovies(data.results);
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setViewMode('search');
    try {
      const data = await withRetry(() => movieAPI.searchMovies(searchQuery));
      if (data.results.length === 0) {
        setError('No movies found. Try a different search term.');
        setShowErrorModal(true);
        setMovies([]);
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      setError(err.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const navigateToDetails = () => {
    if (selectedMovie) {
      alert(`Movie ID: ${selectedMovie.id}\nTitle: ${selectedMovie.title}\n\nGabriel will create the Details screen!`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadMovies('trending');
  };

  const MovieCard = ({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.movieCard}
          onPress={() => handleMoviePress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: movieAPI.getImageUrl(item.poster_path) || 'https://via.placeholder.com/500x750?text=No+Image',
            }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
              </View>
              <Text style={styles.year}>
                {item.release_date ? item.release_date.split('-')[0] : 'N/A'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Movie Explorer</Text>
        <Text style={styles.headerSubtitle}>Advanced API by Maryan & Animations by Mauwanu</Text>

        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryPill, viewMode === 'trending' && styles.categoryPillActive]}
            onPress={() => loadMovies('trending')}
          >
            <Text style={[styles.categoryText, viewMode === 'trending' && styles.categoryTextActive]}>
              🔥 Trending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryPill, viewMode === 'popular' && styles.categoryPillActive]}
            onPress={() => loadMovies('popular')}
          >
            <Text style={[styles.categoryText, viewMode === 'popular' && styles.categoryTextActive]}>
              ⭐ Popular
            </Text>
          </TouchableOpacity>
          {viewMode === 'search' && (
            <TouchableOpacity
              style={[styles.categoryPill, styles.categoryPillActive]}
              onPress={clearSearch}
            >
              <Text style={styles.categoryTextActive}>🔍 Search • Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1e90ff']}
            tintColor="#1e90ff"
          />
        }
        renderItem={({ item, index }) => <MovieCard item={item} index={index} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyText}>No movies to display</Text>
            <Text style={styles.emptySubtext}>Try searching or refreshing</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={() => loadMovies('trending')}>
              <Text style={styles.reloadButtonText}>Load Trending Movies</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          movies.length > 0 ? (
            <View style={styles.resultHeader}>
              <Text style={styles.resultText}>
                {movies.length} {viewMode === 'search' ? 'results' : 'movies'} found
              </Text>
            </View>
          ) : null
        }
      />

      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
        onRetry={() => {
          setShowErrorModal(false);
          if (viewMode === 'search' && searchQuery) {
            handleSearch();
          } else {
            loadMovies(viewMode);
          }
        }}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={navigateToDetails}
        title="View Movie Details?"
        message={`Do you want to see more information about "${selectedMovie?.title}"?`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 20,
    color: '#1e90ff',
    fontWeight: '700',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 2,
    borderBottomColor: '#1e90ff',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#87ceeb',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryPillActive: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  categoryText: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#0a0a0a',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  resultHeader: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    width: '100%',
  },
  resultText: {
    color: '#87ceeb',
    fontSize: 14,
    fontWeight: '600',
  },
  movieCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#1a1a1a',
  },
  movieInfo: {
    padding: 12,
    backgroundColor: '#0a0a0a',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  rating: {
    fontSize: 12,
    color: '#87ceeb',
    fontWeight: '700',
  },
  year: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    width: '100%',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#999',
    marginBottom: 24,
  },
  reloadButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});