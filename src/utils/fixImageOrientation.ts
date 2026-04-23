import EXIF from "exif-js"

export async function fixImageOrientation(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        // 👇 AQUI está a correção do erro do "this"
        EXIF.getData(img, function (this: any) {
          const orientation = EXIF.getTag(this, "Orientation") as number | undefined

          if (!orientation || orientation === 1) {
            resolve(file)
            return
          }

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")!

          const width = img.width
          const height = img.height

          if ([5, 6, 7, 8].includes(orientation)) {
            canvas.width = height
            canvas.height = width
          } else {
            canvas.width = width
            canvas.height = height
          }

          switch (orientation) {
            case 3:
              ctx.rotate(Math.PI)
              ctx.drawImage(img, -width, -height)
              break

            case 6:
              ctx.rotate(Math.PI / 2)
              ctx.drawImage(img, 0, -height)
              break

            case 8:
              ctx.rotate(-Math.PI / 2)
              ctx.drawImage(img, -width, 0)
              break

            default:
              ctx.drawImage(img, 0, 0)
          }

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            const fixedFile = new File([blob], file.name, {
              type: "image/jpeg",
            })

            resolve(fixedFile)
          }, "image/jpeg", 0.95)
        })
      }
    }

    reader.readAsDataURL(file)
  })
}