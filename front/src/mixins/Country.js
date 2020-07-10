export const Country = {
  data: function () {
    return {
      data: '',
      code: ''
    }
  },
  methods: {
    async loadData (additionalFields) {
      const requestBody = {
        searchField: 'isoAlpha3',
        value: this.code
      }
      // try {
      const response = await fetch('http://localhost:8080/api/getCountry', {
        method: 'POST',
        // credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      if (response.redirected) {
        window.location.href = response.url
        return
      }
      const data = await response.json() // api geonames object
      if (!data.ok) {
        throw new Error(data.caption)
      }
      this.data = data.foundCountry // api rest countries object
      await this.loadAdditionalData(additionalFields)
      // } catch (err) {
      //     throw err;
      // }
    },
    async loadAdditionalData (fieldsArray) {
      const joinedFields = fieldsArray.join(';')
      const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.code}?fields=${joinedFields}`)
      if (response.status === 404) {
        throw new Error('Не удалось загрузить дополнительную информацию (карту и языки)')
      }
      this.data.additional = await response.json()
    }
  }
}
