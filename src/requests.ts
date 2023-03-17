import axios from 'axios'

export const postMetapediaCategory = (title: string, lang: string) => {
  return axios.post('https://api.nikepai.com:10444/v/2.0/metapedia/v1/category', {
    title,
    lang,
  })
}
