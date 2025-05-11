export default function PageTitle({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-200 p-2 shadow-md">
        <img src={icon || "/placeholder.svg"} alt={title} className="h-full w-full object-contain" />
      </div>
      <h1 className="font-arcade text-3xl text-purple-800">{title}</h1>
    </div>
  )
}
