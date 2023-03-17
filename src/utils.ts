import zhConvertor from 'zhconvertor'

export const T2S = (str: string) => {
  if (!str)
    return ''
  return zhConvertor.t2s(str.replaceAll('_', ' '))
}
