<template>
  <vue-paycard
    :labels="labels"
    :value-fields="valueFields"
    :input-fields="inputFields"
    :has-random-backgrounds="false"
  />
  <div class="mt-10 flex w-full flex-col items-start items-center justify-between gap-3 pr-5">
    <div class="flex w-full items-center justify-between">
      <label class="font-semibold" for="v-card-name">Card Holder</label>
      <input
        class="cursor-pointer appearance-none rounded-md bg-slate-500/20 px-2 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
        type="text"
        title="Name"
        :value="valueFields.cardName"
        @input="changeName"
        data-card-field
        autocomplete="off"
      />
    </div>
    <div class="flex w-full items-center justify-between">
      <label class="font-semibold" for="v-card-number">Card Number:</label>
      <input
        class="cursor-pointer appearance-none rounded-md bg-slate-500/20 px-2 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
        type="tel"
        :id="inputFields.cardNumber"
        title="Number"
        :value="valueFields.cardNumber"
        @input="changeNumber"
        data-card-field
        autocomplete="off"
        :maxlength="cardNumberMaxLength"
      />
    </div>
    <div class="flex w-full items-center justify-between">
      <label class="font-semibold" for="v-card-month" aria-label="Expiration Date">Expiration Date</label>
      <div>
        <select
          class="mr-3 cursor-pointer appearance-none rounded-md bg-slate-500/20 px-2 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
          aria-label="Card Month"
          title="Month"
          v-model="valueFields.cardMonth"
          data-card-field
        >
          <option class="bg-slate-900 text-white" value disabled selected>Month</option>
          <option
            class="bg-slate-900 text-white"
            v-bind:value="n < 10 ? '0' + n : n"
            v-for="n in 12"
            v-bind:disabled="n < minCardMonth"
            v-bind:key="n"
          >
            {{ generateMonthValue(n) }}
          </option>
        </select>
        <select
          class="cursor-pointer appearance-none rounded-md bg-slate-500/20 px-2 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
          aria-label="Card year"
          title="Year"
          v-model="valueFields.cardYear"
          data-card-field
        >
          <option class="bg-slate-900 text-white" value disabled selected>Year</option>
          <option
            class="bg-slate-900 text-white"
            v-bind:value="$index + minCardYear"
            v-for="(n, $index) in 12"
            v-bind:key="n"
          >
            {{ $index + minCardYear }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex w-full items-center justify-between">
      <label class="font-semibold" for="cardCvv" aria-label="Card CVV">CVV</label>
      <input
        class="cursor-pointer appearance-none rounded-md bg-slate-500/20 px-2 py-2 text-slate-100 outline-none hover:bg-slate-500/60 disabled:cursor-no-drop"
        type="tel"
        title="CVV"
        :id="inputFields.cardCvv"
        maxlength="4"
        :value="valueFields.cardCvv"
        @input="changeCvv"
        data-card-field
        autocomplete="off"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['input-card-number', 'input-card-name', 'input-card-cvv', 'valueChane'])

const cardNumberMaxLength = ref<number>(19)
const minCardYear = ref<number>(new Date().getFullYear())

const valueFields = ref({
  cardName: '',
  cardNumber: '',
  cardMonth: null,
  cardYear: null,
  cardCvv: null
})
const inputFields = ref({
  cardNumber: 'v-card-number',
  cardName: 'v-card-name',
  cardMonth: 'v-card-month',
  cardYear: 'v-card-year',
  cardCvv: 'v-card-cvv'
})
const labels = ref({
  cardName: 'Full Name',
  cardHolder: 'Card Holder',
  cardMonth: 'MM',
  cardYear: 'YY',
  cardExpires: 'Expires',
  cardCvv: 'CVV'
})

watch(
  valueFields,
  () => {
    emit('valueChane', valueFields)
  },
  { deep: true }
)

const minCardMonth = computed(() => {
  if (valueFields.value.cardYear === minCardYear.value) return new Date().getMonth() + 1
  return 1
})

const changeCvv = (e: any) => {
  valueFields.value.cardCvv = e.target.value
  emit('input-card-cvv', valueFields.value.cardCvv)
}

const changeName = (e: any) => {
  valueFields.value.cardName = e.target.value
  emit('input-card-name', valueFields.value.cardName)
}

const changeNumber = (e: any) => {
  valueFields.value.cardNumber = e.target.value
  const value = valueFields.value.cardNumber.replace(/\D/g, '')
  // american express, 15 digits
  if (/^3[47]\d{0,13}$/.test(value)) {
    valueFields.value.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    cardNumberMaxLength.value = 17
  } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
    // diner's club, 14 digits
    valueFields.value.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    cardNumberMaxLength.value = 16
  } else if (/^62[0-9]\d*/.test(value)) {
    valueFields.value.cardNumber = value
      .replace(/(\d{6})/, '$1 ')
      .replace(/(\d{6}) (\d{7})/, '$1 $2 ')
      .replace(/(\d{6}) (\d{7}) (\d{6})/, '$1 $2 $3 ')
      .replace(/(\d{5}) (\d{5}) (\d{5}) (\d{4})/, '$1 $2 $3 $4')
    cardNumberMaxLength.value = 21
  } else if (/^\d{0,16}$/.test(value)) {
    // regular cc number, 16 digits
    valueFields.value.cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
    cardNumberMaxLength.value = 19
  }
  // eslint-disable-next-line
  if (e.inputType == 'deleteContentBackward') {
    const lastChar = valueFields.value.cardNumber.substring(
      valueFields.value.cardNumber.length,
      valueFields.value.cardNumber.length - 1
    )
    // eslint-disable-next-line
    if (lastChar == ' ') {
      valueFields.value.cardNumber = valueFields.value.cardNumber.substring(0, valueFields.value.cardNumber.length - 1)
    }
  }
  emit('input-card-number', valueFields.value.cardNumber)
}

const generateMonthValue = (n: number) => {
  return n < 10 ? `0${n}` : n
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
