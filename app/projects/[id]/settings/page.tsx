import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projectById } from "@/lib/mock-data"

export default async function ProjectSettings({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-3xl py-10 space-y-8">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Project settings
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          How is this project configured?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Mirrors the extension&apos;s advanced settings so cloud crawls and your
          browser-side crawls produce identical inventories.
        </p>
      </header>
      {/* General */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-5">
        <header>
          <h2 className="font-medium">General</h2>
          <p className="text-xs text-muted-foreground">Project name and starting point.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" defaultValue={project.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Starting URL or domain</Label>
            <Input id="domain" defaultValue={`https://${project.domain}`} />
          </div>
        </div>
      </section>

      {/* Crawl */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-5">
        <header>
          <h2 className="font-medium">Crawl configuration</h2>
          <p className="text-xs text-muted-foreground">
            Tune scope and rate. Identical to the extension's advanced settings.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Select defaultValue={project.schedule}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Max pages per crawl</Label>
            <Input type="number" defaultValue={5000} />
          </div>
          <div className="space-y-2">
            <Label>Concurrency</Label>
            <Input type="number" defaultValue={4} />
          </div>
          <div className="space-y-2">
            <Label>User agent</Label>
            <Input defaultValue="AwesomeSEO/1.0 (+https://awesomeseo.app/bot)" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exclude">Exclude paths (one per line)</Label>
          <Textarea id="exclude" rows={4} defaultValue={"/admin/*\n/preview/*\n/checkout/*"} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
            <span className="text-sm">Render JavaScript</span>
            <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
            <span className="text-sm">Respect robots.txt</span>
            <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
            <span className="text-sm">Mobile viewport</span>
            <Switch defaultChecked />
          </label>
        </div>
      </section>

      {/* AI */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-5">
        <header>
          <h2 className="font-medium">AI defaults</h2>
          <p className="text-xs text-muted-foreground">
            Brand voice, target keywords, and competitor URLs used by AI workflows.
          </p>
        </header>
        <div className="space-y-2">
          <Label htmlFor="voice">Brand voice</Label>
          <Textarea
            id="voice"
            rows={3}
            defaultValue="Friendly, direct, and quietly confident. We avoid jargon and pick the simplest accurate word."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kw">Primary keywords</Label>
            <Input id="kw" defaultValue="merino runner, sustainable shoes, wool sneaker" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comp">Competitor URLs</Label>
            <Input id="comp" defaultValue="allbirds.com, vessi.com" />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
        <header>
          <h2 className="font-medium text-destructive">Danger zone</h2>
          <p className="text-xs text-muted-foreground">
            Permanently delete this project and all of its crawl history.
          </p>
        </header>
        <Button variant="destructive">Delete project</Button>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
