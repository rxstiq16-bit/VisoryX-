"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, Download, CheckCircle, XCircle, AlertTriangle, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportRow {
  row: number
  data: Record<string, string>
  status: "pending" | "valid" | "error" | "imported"
  errors: string[]
}

const requiredFields = ["customer_email", "service_type", "title"]
const optionalFields = ["description", "price", "priority", "deadline", "notes"]

const sampleData = `customer_email,service_type,title,description,price,priority,deadline
john@example.com,erlc-livery,Police Department Fleet,5 matching liveries for patrol vehicles,299,normal,2024-03-15
jane@example.com,discord-branding,Gaming Community Server,Full Discord branding package,149,rush,2024-03-10
mike@example.com,logo-design,Tech Startup Logo,Modern minimalist logo design,199,normal,2024-03-20`

export function BulkOrderImport() {
  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const parseCSV = (content: string): ImportRow[] => {
    const lines = content.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"))

    return lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim())
      const data: Record<string, string> = {}
      headers.forEach((header, i) => {
        data[header] = values[i] || ""
      })

      const errors: string[] = []
      requiredFields.forEach((field) => {
        if (!data[field]) {
          errors.push(`Missing required field: ${field}`)
        }
      })

      if (data.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)) {
        errors.push("Invalid email format")
      }

      if (data.price && isNaN(parseFloat(data.price))) {
        errors.push("Invalid price format")
      }

      return {
        row: index + 2,
        data,
        status: errors.length > 0 ? "error" : "valid",
        errors,
      }
    })
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsedRows = parseCSV(content)
      setRows(parsedRows)
    }
    reader.readAsText(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([sampleData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "order-import-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    setImporting(true)
    const validRows = rows.filter((r) => r.status === "valid")

    for (let i = 0; i < validRows.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setRows((prev) =>
        prev.map((r) =>
          r.row === validRows[i].row ? { ...r, status: "imported" } : r
        )
      )
      setImportProgress(((i + 1) / validRows.length) * 100)
    }

    setImporting(false)
  }

  const clearFile = () => {
    setFile(null)
    setRows([])
    setImportProgress(0)
  }

  const validCount = rows.filter((r) => r.status === "valid").length
  const errorCount = rows.filter((r) => r.status === "error").length
  const importedCount = rows.filter((r) => r.status === "imported").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Order Import</h2>
          <p className="text-muted-foreground">Import multiple orders from CSV or Excel files</p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      {!file ? (
        <Card>
          <CardContent className="p-0">
            <div
              className={cn(
                "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload CSV or Excel File</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag and drop your file here, or click to browse</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-base">{file.name}</CardTitle>
                    <CardDescription>{(file.size / 1024).toFixed(1)} KB</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <span className="font-semibold">{rows.length}</span> total rows
                </Badge>
                <Badge variant="default" className="gap-1 bg-green-500">
                  <CheckCircle className="h-3 w-3" />
                  {validCount} valid
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {errorCount} errors
                  </Badge>
                )}
                {importedCount > 0 && (
                  <Badge variant="default" className="gap-1 bg-blue-500">
                    <CheckCircle className="h-3 w-3" />
                    {importedCount} imported
                  </Badge>
                )}
              </div>

              {importing && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Importing orders...</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="errors" className="gap-1">
                    Errors
                    {errorCount > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">{errorCount}</Badge>}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <div className="border rounded-lg overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Row</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.row} className={row.status === "error" ? "bg-destructive/10" : ""}>
                            <TableCell className="font-mono text-sm">{row.row}</TableCell>
                            <TableCell>
                              {row.status === "valid" && <Badge variant="secondary">Valid</Badge>}
                              {row.status === "error" && <Badge variant="destructive">Error</Badge>}
                              {row.status === "imported" && <Badge className="bg-green-500">Imported</Badge>}
                              {row.status === "pending" && <Badge variant="outline">Pending</Badge>}
                            </TableCell>
                            <TableCell>{row.data.customer_email || "-"}</TableCell>
                            <TableCell>{row.data.service_type || "-"}</TableCell>
                            <TableCell className="max-w-xs truncate">{row.data.title || "-"}</TableCell>
                            <TableCell>${row.data.price || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="errors">
                  {errorCount === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>No errors found</AlertTitle>
                      <AlertDescription>All rows are valid and ready to import.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-2">
                      {rows.filter((r) => r.status === "error").map((row) => (
                        <Alert key={row.row} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Row {row.row}</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside">
                              {row.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearFile}>Cancel</Button>
            <Button onClick={handleImport} disabled={validCount === 0 || importing}>
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import {validCount} Orders
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
