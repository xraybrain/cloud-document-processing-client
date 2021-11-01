export class DocIconMap {
  private static icons = {
    zip: "las la-file-archive",
    doc: "las la-file-word",
    docx: "las la-file-word",
    mp3: "las la-file-audio",
    mp4: "las la-file-video",
    pdf: "las la-file-pdf",
    xlsx: "las la-file-excel",
    ppt: "las la-file-excel",
  };

  static getIcon(ext: string) {
    return this.icons[ext] || "las la-file-alt";
  }
}
