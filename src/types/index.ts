export type Mode =
  | '100644'
  | '100755'
  | '040000'
  | '160000'
  | '120000'
  | undefined

export type TreeType = 'blob' | 'commit' | 'tree' | undefined

export type TreeEntry = {
  path?: string | undefined
  mode?: Mode
  type?: TreeType
  sha?: string | null | undefined
  content?: string | undefined
}

export type Tree = TreeEntry[]

export type GitFileChangeType = 'A' | 'M' | 'D' | 'R' | undefined

export type GitFileChange = {
  action: GitFileChangeType
  old_path: string
  new_path?: string
}
