
export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="p-8 text-center border rounded shadow-sm">
          <p className="text-lg font-medium">Confirmation failed. The link may be invalid or expired.</p>
      </div>
    </div>
  )
}