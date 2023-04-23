type Mode = '100644' | '100755' | '040000' | '160000' | '120000' | undefined

export type Tree = {
  path?: string | undefined
  mode?: Mode
  type?: 'blob' | 'commit' | 'tree' | undefined
  sha?: string | null | undefined
  content?: string | undefined
}[]
