use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub fn encode(
  image: &[u8],
  width: u32,
  height: u32,
  palette: Option<Vec<u8>>,
  trns: Option<Vec<u8>>,
  color: Option<u8>,
  depth: Option<u8>,
  compression: Option<u8>,
  filter: Option<u8>,
) -> Result<Vec<u8>, JsValue> {
  let mut dest = Vec::new();

  {
    let mut encoder = png::Encoder::new(&mut dest, width, height);

    if let Some(palette) = palette {
      encoder.set_palette(palette.to_vec());
    }
  
    if let Some(trns) = trns {
      encoder.set_trns(trns.to_vec());
    }
  
    if let Some(color) = color {
      if let Some(color) = png::ColorType::from_u8(color) {
        encoder.set_color(color);
      }
    }
  
    if let Some(depth) = depth {
      if let Some(depth) = png::BitDepth::from_u8(depth) {
        encoder.set_depth(depth);
      }
    }
  
    if let Some(compression) = compression {
      match compression {
        0 => encoder.set_compression(png::Compression::Default),
        1 => encoder.set_compression(png::Compression::Fast),
        2 => encoder.set_compression(png::Compression::Best),
        3 => encoder.set_compression(png::Compression::Huffman),
        4 => encoder.set_compression(png::Compression::Rle),
        _ => (),
      }
    }
  
    if let Some(filter) = filter {
      if let Some(filter) = png::FilterType::from_u8(filter) {
        encoder.set_filter(filter);
      }
    }
  
    let mut writer = match encoder.write_header() {
      Ok(writer) => writer,
      Err(err) => {
        return Err(JsValue::from_str(&format!("{}", err)));
      }
    };
  
    if let Err(err) = writer.write_image_data(image) {
      return Err(JsValue::from_str(&format!("{}", err)));
    }
  }

  Ok(dest)
}
