<script setup>
import axios from 'axios'
const searchTerm = ref('')
const suggestions = ref([])
const showSuggestion = ref(false)
const selectedSuggestion = ref(0)
const updateSearchTerm = (event) => {
  searchTerm.value = event.target.value
}
const search = () => { }
const getSuggestions = async () => {
  if (searchTerm.value.length > 0) {
    try {
    //   const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm.value}&format=json&origin=*`)
      const response = await axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/query', {
        query: searchTerm.value,
        namespace: 0,
        lang: 'zh',
      })
      suggestions.value = response.data.data.map(result => result.title)
      showSuggestion.value = true
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    suggestions.value = []
    showSuggestion.value = false
  }
}
const selectSuggestion = (suggestion) => {
  searchTerm.value = suggestion
  showSuggestion.value = false
}
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestion.value = false
  }, 300)
}
const showSuggestions = () => {
  getSuggestions()
}
const filteredSuggestions = computed(() => {
  return suggestions.value.filter(suggestion => suggestion.toLowerCase().startsWith(searchTerm.value.toLowerCase()))
})
const moveSelection = (direction) => {
  if (direction === 'up')
    selectedSuggestion.value = selectedSuggestion.value === 0 ? filteredSuggestions.value.length - 1 : selectedSuggestion.value - 1
  else selectedSuggestion.value = (selectedSuggestion.value + 1) % filteredSuggestions.value.length
}
</script>

<template>
  <div class="search-box">
    <input
      ref="searchInput" type="text" class="search-input" :value="searchTerm"
      @input="updateSearchTerm" @keyup.enter="search" @blur="hideSuggestions" @focus="showSuggestions"
    >
    <ul v-if="showSuggestion" class="suggestions">
      <li
        v-for="(suggestion, index) in suggestions" :key="index" :class="{ selected: selectedSuggestion === index }"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<style>
 .search-box {
     position: relative;
     width: 100%;
 }

 .search-input {
     width: 100%;
     padding: 10px;
     border-radius: 5px;
     border: 1px solid #ccc;
     font-size: 16px;
     outline: none;
 }

 .suggestions {
     position: absolute;
     top: 40px;
     left: 0;
     right: 0;
     max-height: 200px;
     overflow-y: auto;
     border-radius: 5px;
     border: 1px solid #ccc;
     background-color: #fff;
     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
     z-index: 1;
 }

 .suggestions li {
     padding: 10px;
     cursor: pointer;
 }

 .suggestions li:hover {
     background-color: #eee;
 }

 .suggestions .selected {
     background-color: #eee;
 }
</style>
