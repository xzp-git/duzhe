import { ColumnProps } from './store/index'

export function generateFitUrl (column: ColumnProps, width: number, height: number) {
  if (column.avatar) {
    column.avatar.url = column.avatar.url + `?x-oss-process=image/resize,m_pad,h_${height},W_${width}`
  } else {
    column.avatar = {
      url: require('@/assets/column.jpg')
    }
  }
}

interface CheckCondition {
  format?:string[];
  size?:number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidSize && isValidFormat,
    error
  }
}
